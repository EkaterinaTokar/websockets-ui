import { players, winners, rooms } from "./db.js";

//update_room
export function updateRoom(ws: WebSocket) {
          const response = {
            type: "update_room",
            data:  JSON.stringify(rooms),
            id: 0
        };
        ws.send(JSON.stringify(response));
}

//update_winners
export function updateWinners(ws: WebSocket) {
            const response = {
            type: "update_winners",
            data:  JSON.stringify(winners),
            id: 0
            };
    ws.send(JSON.stringify(response));
}