import { WebSocket } from 'ws';
import { Player, Room, Game, WebSocketId } from "./interface.js";
import { players, rooms, games, gameRooms } from "./db.js";
import { updateRooms } from "./update.js";


export function createNewRoom(ws: WebSocketId) {
   const player = getPlayerByWS(ws);
   
    if (!player) {
        console.error("Player not found for WebSocket:", ws);
        return;
    }
    const newRoom: Room = {
        roomId: Math.floor(Math.random() * 1000000),
        roomUsers: [],
    };
    rooms.push(newRoom);
    newRoom.roomUsers.push({
                name: player.name,
                index: player.index,
                ws
            })
    updateRooms(ws);
  console.log("Room created and player added to the room");
}


export function addUserToRoom(ws: WebSocketId, data: any) {
    const { indexRoom } = JSON.parse(data);
    let room = rooms.find(room => room.roomId === indexRoom && room.roomUsers.length < 2);

    const player = getPlayerByWS(ws);
    
    if (room && player && !isPlayerInRoom(player, room)) {
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
        room.roomUsers.forEach(player => {
            newGame.players.push({
              player: player,
                ships: [],
                enemyShips:[],
            });
            
         const response = {
            type: 'create_game',
            data: JSON.stringify({
                idGame: newGame.gameId,  
                idPlayer: player.index,
          }),
            id: 0,
           };
            player.ws?.send(JSON.stringify(response));
            if (player.ws) {
                 const roomIndex = rooms.findIndex(room => room.roomId === indexRoom)
                 gameRooms.push(rooms.splice(roomIndex, 1)[0]);
                updateRooms(player.ws);
            } 
        })
        console.log("Player added to the room and game created");
    }
}

function getPlayerByWS(ws: WebSocketId): Player | undefined {
  return players.find(player => player.ws === ws);
}

function isPlayerInRoom(player: Player, room: Room): boolean {
  return room.roomUsers.some(user => user.ws === player.ws);
}