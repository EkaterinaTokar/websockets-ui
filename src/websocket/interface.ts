import { WebSocket } from 'ws';

export interface WebSocketId extends WebSocket {
    id: string;
}
export interface Player {
  name: string;
  password?: string;
  index: number;
  wins?: number;
  ws?: WebSocket; 
}
export interface Winner {
  name: string;
  wins: number;
}

export interface Room {
  roomId: number;
  roomUsers: Player[];
}
