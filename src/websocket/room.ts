import { WebSocket } from 'ws';
import { Player, Room, WebSocketId } from "./interface.js";
import { players, rooms } from "./db.js";
import { updateWinners, updateRooms } from "./update.js"


export function createNewRoom(ws: WebSocketId) {
   const player = getPlayerByWS(ws);
   
    if (!player) {
        console.error("Player not found for WebSocket:", ws);
        return;
    }
    const newRoom: Room = {
        roomId: rooms.length + 1,
        roomUsers: [],
    };
    rooms.push(newRoom);
    newRoom.roomUsers.push({
                name: player.name,
                index: player.index,
                ws
            })
    updateRooms(ws);
}

function getPlayerByWS(ws: WebSocketId ): Player | undefined {
  return players.find(player => player.ws === ws);
}