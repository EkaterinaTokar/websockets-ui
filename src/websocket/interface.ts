import { WebSocket } from 'ws';

export interface WebSocketId extends WebSocket {
    id: string;
}
export interface Player {
  id?: string,
  name: string;
  password?: string;
  index: number;
  wins?: number;
  ws?: WebSocketId; 
}
export interface Winner {
  name: string;
  wins: number;
}

export interface Room {
  roomId: number;
  roomUsers: Player[];
}
export interface Position {
    x: number;
    y: number;
}
export interface Ship {
  position: Position;
  direction: boolean;
  length: number;
  type: "small" | "medium" | "large" | "huge";
  status?: string; //'miss' | 'shot' | 'killed';
  hits?: [];
}

export interface Game {
    gameId: number;
    players: {
      player: Player;
      ships: Ship[]; /* player's ships, not enemy's */
      enemyShips: Cell[];
    }[];
    currentPlayerIndex: number;
}
export interface Cell {
    x: number;
    y: number;
    status: string;
    hits?: [];
}
