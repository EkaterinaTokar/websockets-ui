import { WebSocketServer, WebSocket } from 'ws';
import { WebSocketId } from "./interface.js";
import { registration } from "./player.js";
import { createNewRoom, addUserToRoom } from "./room.js";
import { addShips } from "./ships.js";

export const wsServer = new WebSocketServer({ port: 3000 });

wsServer.on('connection',  (ws: WebSocketId ) => {
    console.log('connect');
    ws.on('message', (message: string) => {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'reg':
               console.log('reg:', data.type);
               registration(ws, data.data);
                break;
            case 'create_room':
                console.log('create_room:', data.type);
                createNewRoom(ws);
                break;
            case 'add_user_to_room':
                console.log('add_user_to_room:', data.type);
                addUserToRoom(ws, data.data);
                break;
            case 'add_ships':
                console.log('add_ships:', data.type);
                addShips(ws, data.data);
            break;
           case 'attack':
           case 'randomAttack':
                console.log('attack:', data.type);
            break;
            default:
                console.log('Unknown message type:', data.type);
        }
    });
    ws.on('close', () => {
        console.log('close connection');
    });
});
