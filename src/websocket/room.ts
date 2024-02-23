import { WebSocket } from 'ws';
import { Player, Room, Game, WebSocketId } from "./interface.js";
import { players, rooms, games } from "./db.js";
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


export function addUserToRoom(ws: WebSocketId, data: any) {
    const { indexRoom } = JSON.parse(data);
    let room = rooms.find(room => room.roomId === indexRoom && room.roomUsers.length < 2);

    const player = getPlayerByWS(ws);
    
    if (room && player) {
        room.roomUsers.push({
            name: player.name,
            index: player.index,
            ws
        });  
     }
    
    if (room?.roomUsers.length === 2) {
         const newGame: Game = {
             gameId: room.roomId,
             players: [],
             currentPlayerIndex: 0,
    };
         games.push(newGame);
        console.log('Creating game for room:', room.roomId);
        room.roomUsers.forEach(player => {
            newGame.players.push({
              player: player,
              ships: [],
            });
            if(player.ws) updateRooms(player.ws);
            
         const response = {
            type: 'create_game',
            data: JSON.stringify({
                idGame: newGame.gameId,  
                idPlayer: player.ws?.id,//player.index
          }),
            id: 0,
           };
            player.ws?.send(JSON.stringify(response));
        })
    }
    // room?.roomUsers.forEach(p => console.log(p.ws?.id, p.name))
}

function getPlayerByWS(ws: WebSocketId): Player | undefined {
  return players.find(player => player.ws === ws);
}
