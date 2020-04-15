export interface Client {
  readonly clientId: string;
  readonly firstSeen: Date;
  lastSeen: Date;
  readonly remoteAddress: string;
  readonly readyState: number;
  authenticated: boolean;

  send(data: string): void;
  close(): void;
}
