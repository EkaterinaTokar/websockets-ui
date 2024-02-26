import { winners, rooms } from "./db.js";
import { WebSocketId } from "./interface.js";
import { WebSocket } from 'ws';

//update_room
export function updateRooms(ws: WebSocketId) {
          const response = {
            type: "update_room",
            data:  JSON.stringify(rooms),
            id: 0
        };
        ws.send(JSON.stringify(response));
}

//update_winners
export function updateWinners(ws: WebSocketId) {
            const response = {
            type: "update_winners",
            data:  JSON.stringify(winners),
            id: 0
            };
    ws.send(JSON.stringify(response));
}