import { WebSocket } from 'ws';
import { Player } from "./interface.js";
import { players } from "./db.js";
import crypto from "crypto";


function generateUUID() {
    const uuid = crypto.randomBytes(16).toString('hex');
    console.log(uuid);
    return Number(uuid);
}

export function registration(ws: WebSocket, data: any) {
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
    } else {
        const newPlayer: Player = {
            id:  generateUUID(),
            name: name,
            password: password,
            index: players.length + 1,
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
        console.log("ws: ", ws);
        //updateWinners(ws);
        //updateRoom(ws);
    }
}
