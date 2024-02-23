import { WebSocketServer, WebSocket } from 'ws';
import { } from "./interface.js";
import { registration } from "./player.js";


export const wsServer = new WebSocketServer({ port: 3000 });

wsServer.on('connection',  (ws: WebSocket) => {
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
                break;
            case 'add_user_to_room':
                console.log('add_user_to_room:', data.type);
                break;
            case 'add_ships':
                console.log('add_ships:', data.type);
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
