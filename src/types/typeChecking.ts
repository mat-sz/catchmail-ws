import { MessageModel } from './Models';

export function isMessageModel(message: any): message is MessageModel {
  return message && 'type' in message && typeof message['type'] === 'string';
}
