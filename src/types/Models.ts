import { MessageType } from './MessageType';

export interface ClientModel {
  clientId: string;
  clientColor: string;
}

export interface MessageModel {
  type: MessageType;
}

export interface WelcomeMessageModel extends MessageModel {
  type: MessageType.WELCOME;
  clientId: string;
  authenticationMode: string;
}

export interface ErrorMessageModel extends MessageModel {
  type: MessageType.ERROR;
  message: string;
}

export interface MailMessageModel extends MessageModel {
  messageId: string;
  type: MessageType.MAIL;
  raw?: string;
}

export interface AuthenticationRequestMessageModel extends MessageModel {
  type: MessageType.AUTHENTICATION_REQUEST;
  secret?: string;
}

export interface AuthenticationResponseMessageModel extends MessageModel {
  type: MessageType.AUTHENTICATION_RESPONSE;
  success: boolean;
  authenticationMode: string;
}
