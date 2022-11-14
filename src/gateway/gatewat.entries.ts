export interface UserSocket {
  user_id: string;
  client_id: string;
}

export interface UserSocketList {
  [client_id: string]: UserSocket;
}
