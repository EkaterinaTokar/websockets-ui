import { WebSocket } from 'ws';

export interface Player {
  id?: number;
  name: string;
  password?: string;
  index: number;
  wins?: number;
  ws?: WebSocket; 
}
export interface Winner {
  id?: number;
  name: string;
  wins: number;
}

export interface Room {
  roomId: number;
  roomUsers: Player[];
}
