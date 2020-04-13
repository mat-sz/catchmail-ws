export interface Client {
  readonly clientId: string;
  readonly firstSeen: Date;
  lastSeen: Date;
  readonly remoteAddress: string;
  readonly readyState: number;

  send(data: string): void;
  close(): void;
}
