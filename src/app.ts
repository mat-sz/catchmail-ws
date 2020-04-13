import WebSocket from 'ws';
import { microMTA } from 'micromta';
import { extract } from 'letterparser';

import { WSClient } from './WSClient';
import { ClientManager } from './ClientManager';
import { MessageType } from './types/MessageType';
import { isMessageModel } from './types/typeChecking';
import { ErrorMessageModel, MailMessageModel } from './types/Models';

// Configuration
const host = process.env.WS_HOST || '127.0.0.1';
const port = parseInt(process.env.WS_PORT) || 5000;

const wss = new WebSocket.Server({ host: host, port: port });
const mta = new microMTA();

const clientManager = new ClientManager();

mta.on('message', async message => {
  const mail = extract(message.message);

  clientManager.broadcast({
    type: MessageType.MAIL,
    ...mail,
    raw: message.message,
  } as MailMessageModel);
});

mta.on('error', error => {
  clientManager.broadcast({
    type: MessageType.ERROR,
    message: error.message,
  } as ErrorMessageModel);
});

wss.on('connection', (ws, req) => {
  const client = new WSClient(ws, req);
  clientManager.addClient(client);

  ws.send(
    JSON.stringify({
      type: 'welcome',
      clientId: client.clientId,
    })
  );

  ws.on('message', (data: string) => {
    // Prevents DDoS and abuse.
    if (!data || data.length > 1024) return;

    try {
      const message = JSON.parse(data);

      if (isMessageModel(message)) {
        clientManager.handleMessage(client, message);
      }
    } catch (e) {}
  });

  ws.on('close', () => {
    clientManager.removeClient(client);
  });
});

setInterval(() => {
  clientManager.removeBrokenClients();
}, 1000);

// Ping clients to keep the connection alive (when behind nginx)
setInterval(() => {
  clientManager.pingClients();
}, 5000);

setInterval(() => {
  clientManager.removeInactiveClients();
}, 10000);

console.log('Server running');
