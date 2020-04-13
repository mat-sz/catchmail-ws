import { Client } from './types/Client';
import { MessageModel } from './types/Models';

export class ClientManager {
  private clients: Client[] = [];

  addClient(client: Client) {
    this.clients.push(client);

    client.send(
      JSON.stringify({
        type: 'welcome',
        clientId: client.clientId,
      })
    );
  }

  handleMessage(client: Client, message: MessageModel) {
    client.lastSeen = new Date();
  }

  broadcast(message: MessageModel) {
    const networkMessage = JSON.stringify(message);

    this.clients.forEach(client => {
      try {
        client.send(networkMessage);
      } catch {}
    });
  }

  pingClients() {
    const pingMessage = JSON.stringify({
      type: 'ping',
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
