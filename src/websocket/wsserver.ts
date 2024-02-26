import { WebSocketServer, WebSocket } from 'ws';
import { WebSocketId } from "./interface.js";
import { registration } from "./player.js";
import { createNewRoom, addUserToRoom } from "./room.js";
import { addShips } from "./ships.js";
import { attackFeedback, randomAttack  } from "./game.js";

export const wsServer = new WebSocketServer({ port: 3000 });

wsServer.on('connection',  (ws: WebSocketId ) => {
    console.log('connect');
    ws.on('message', (message: string) => {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'reg':
               console.log(data.type);
               registration(ws, data.data);
                break;
            case 'create_room':
                console.log(data.type);
                createNewRoom(ws);
                break;
            case 'add_user_to_room':
                console.log(data.type);
                addUserToRoom(ws, data.data);
                break;
            case 'add_ships':
                console.log(data.type);
                addShips(ws, data.data);
            break;
           case 'attack':
                console.log(data.type);
                attackFeedback(ws, data.data);
                break;
            case 'randomAttack':
                console.log(data.type);
                randomAttack(ws, data.data);
                break;
            default:
                console.log('Unknown message type:', data.type);
        }
    });
    ws.on('close', () => {
       console.log('Connection closed.');
    });
});

process.on('SIGINT', () => {
    console.log('WebSocket server is shutting down...');
    wsServer.close(() => {
        console.log('WebSocket server closed.');
        process.exit(0);
    });
});