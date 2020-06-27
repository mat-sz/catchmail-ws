import { Client } from './types/Client';
import {
  MessageModel,
  AuthenticationRequestMessageModel,
  AuthenticationResponseMessageModel,
  WelcomeMessageModel,
  MailMessageModel,
} from './types/Models';
import { MessageType } from './types/MessageType';

export class ClientManager {
  private clients: Client[] = [];
  private cache: string[] = [];
  authenticate: (request: AuthenticationRequestMessageModel) => boolean;
  authenticationMode: string = 'none';
  cacheSize: number = 0;

  addClient(client: Client) {
    this.clients.push(client);

    client.send(
      JSON.stringify({
        type: MessageType.WELCOME,
        clientId: client.clientId,
        authenticationMode: this.authenticationMode,
      } as WelcomeMessageModel)
    );
  }

  handleMessage(client: Client, message: MessageModel) {
    client.lastSeen = new Date();

    if (message.type === MessageType.AUTHENTICATION_REQUEST) {
      const success = this.authenticate(
        message as AuthenticationRequestMessageModel
      );
      client.authenticated = success;
      client.send(
        JSON.stringify({
          type: MessageType.AUTHENTICATION_RESPONSE,
          success,
          authenticationMode: this.authenticationMode,
        } as AuthenticationResponseMessageModel)
      );
    }
  }

  addMail(raw: string) {
    this.broadcast({
      type: MessageType.MAIL,
      raw,
    } as MailMessageModel);

    if (this.cacheSize <= 0) {
      return;
    }

    this.cache.push(raw);

    if (this.cache.length > this.cacheSize) {
      this.cache.shift();
    }
  }

  broadcast(message: MessageModel) {
    const networkMessage = JSON.stringify(message);

    this.clients.forEach(client => {
      if (!client.authenticated) return;

      try {
        client.send(networkMessage);
      } catch {}
    });
  }

  pingClients() {
    const pingMessage = JSON.stringify({
      type: MessageType.PING,
      timestamp: new Date().getTime(),
    });

    this.clients.forEach(client => {
      if (client.readyState !== 1) return;

      try {
        client.send(pingMessage);
      } catch {
        this.removeClient(client);
        client.close();
      }
    });
  }

  removeClient(client: Client) {
    this.clients = this.clients.filter(c => c !== client);
  }

  removeBrokenClients() {
    this.clients = this.clients.filter(client => {
      if (client.readyState <= 1) {
        return true;
      } else {
        return false;
      }
    });
  }

  removeInactiveClients() {
    const minuteAgo = new Date(Date.now() - 1000 * 20);

    this.clients.forEach(client => {
      if (client.readyState !== 1) return;

      if (client.lastSeen < minuteAgo) {
        this.removeClient(client);
        client.close();
      }
    });
  }
}
