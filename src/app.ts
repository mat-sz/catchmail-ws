import WebSocket from 'ws';
import { writeFile } from 'fs';
import { microMTA } from 'micromta';

import { WSClient } from './WSClient';
import { ClientManager } from './ClientManager';
import { MessageType } from './types/MessageType';
import { isMessageModel } from './types/typeChecking';
import { ErrorMessageModel, MailMessageModel } from './types/Models';

// Configuration
const host = process.env.WS_HOST || '127.0.0.1';
const port = parseInt(process.env.WS_PORT) || 5000;
const authenticationMode = process.env.AUTH_MODE || 'none';
const authenticationSecret = process.env.AUTH_SECRET;
const cacheSize = parseInt(process.env.CACHE_SIZE) || 0;
const logMode = process.env.LOG_MODE || 'none';

const wss = new WebSocket.Server({ host: host, port: port });
const mta = new microMTA();

const clientManager = new ClientManager();
clientManager.cacheSize = cacheSize;
clientManager.authenticationMode = authenticationMode;
clientManager.authenticate = request => {
  switch (authenticationMode) {
    case 'none':
      return true;
    case 'secret':
      return request.secret === authenticationSecret;
    default:
      return false;
  }
};

mta.on('message', async message => {
  if (logMode === 'file') {
    writeFile(
      './log/' + new Date().getTime() + '.eml',
      message.message.replace(/\r/g, ''),
      () => {}
    );
  }

  clientManager.addMail(message.message);
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
