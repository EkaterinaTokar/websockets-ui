import { WebSocket } from 'ws';
import { Player, WebSocketId } from "./interface.js";
import { players } from "./db.js";
import crypto from "crypto";
import { updateWinners, updateRooms } from "./update.js";


function generateUUID() {
    const hash = crypto.createHash('sha1').update(crypto.randomBytes(16)).digest('hex');
    const uuid = parseInt(hash.substring(0, 8), 16);
    return uuid;
}

export function registration(ws: WebSocketId, data: any) {
    const { name, password } = JSON.parse(data);
    const player = players.find(player => player.name === name);
    if (player) {
        const response = {
            type: "reg",
            data: JSON.stringify({
                name: name,
                index: -1, 
                error: true,
                errorText: `${name} already exists`
            }),
            id: 0
        };
        ws.send(JSON.stringify(response));
        console.log("Player already exists");
    } else {
        ws.id = generateUUID();
        const newPlayer: Player = {
            name: name,
            password: password,
            index: ws.id, //players.length + 1
            wins: 0,
            ws
        };
        players.push(newPlayer);
        const response = {
            type: "reg",
            data: JSON.stringify({
             name: newPlayer.name,
             index: newPlayer.index,
            error: false,
            errorText: ''
        }),
            id: 0
        };
        ws.send(JSON.stringify(response));
        console.log("Player registered successfully");

        if (players.length > 1) {
        players.forEach(player => {
          if(player.ws) updateWinners(player.ws);
        });
        players.forEach(player => {
          if(player.ws) updateRooms(player.ws);
        });
         console.log("updateWinners & updateRooms");
        } else {
           updateWinners(ws);
           updateRooms(ws);
           console.log("updateWinners & updateRooms");
        }
    }
}
