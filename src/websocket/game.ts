import { WebSocket } from 'ws';
import { Game, WebSocketId, Ship, Winner } from "./interface.js";
import { games, gameRooms, players, winners } from "./db.js";
import { sendTurnInfo } from './ships.js';
import { updateWinners } from './update.js';



function findShipByPosition(x: number, y: number, player: any) {
    for (const ship of player.ships) {
        if (
            (ship.direction && ship.position.x === x && y >= ship.position.y && y < ship.position.y + ship.length) ||
            (!ship.direction && ship.position.y === y && x >= ship.position.x && x < ship.position.x + ship.length)
        ) {
            return ship;
        }
    }
    return null;
}

function sendMessage(playerId: any, message: any) {
  const playerSocket = players.find(player => player.index === playerId);
  if (playerSocket) {
    playerSocket.ws?.send(JSON.stringify(message));
  }
}


export function attackFeedback(ws: WebSocketId, data: any) {
    const { gameId, x, y, indexPlayer } = JSON.parse(data);
    const game = games.find(game => game.gameId === gameId);
    if (game) {
        //const currentPlayerIndex = game.currentPlayerIndex;
        const currentPlayer = game.players.find(player => player.player.index === indexPlayer);
        const enemyPlayer = game.players.find(player => player.player.index !== indexPlayer);
        let attackResult = 'miss';
        
        const attackedShip = findShipByPosition(x, y, enemyPlayer);
        if (attackedShip) {
            console.log("attackedShip", attackedShip);
            attackedShip.hits.push({ x, y });
            const hitsCount = attackedShip.hits.length;
            if (hitsCount === attackedShip.length) {
                attackResult = 'killed';
                attackedShip.status = 'killed';
                if (enemyPlayer?.ships.every(ship => ship.status == 'killed')) {
                    finishGame(ws, game, indexPlayer);
                }
            } else {
              attackResult = 'shot';
              attackedShip.status = 'shot';
           }
        } else {
            attackResult = 'miss';
        }

         game.players.forEach(player => {
            const playerIndex = player.player.index;
            const isCurrentPlayer = playerIndex === currentPlayer?.player.index;
            sendMessage(playerIndex, {
                type: 'attack',
                data: JSON.stringify({
                    position: { x, y },
                    currentPlayer: currentPlayer?.player.index,
                    status: attackResult,
                }),
            });
        });
        
        if (attackResult === 'miss') {
            const enemyPlayerIndex = game?.players.find(player => player.player.index !== indexPlayer)?.player.index ?? -1;
            console.log("enemyPlayerIndex", enemyPlayerIndex);
            sendTurnInfo(game, enemyPlayerIndex, indexPlayer);
        }
    }
}

function isAttacked(x: number, y: number, player: any) {
   return player?.ships.find((cell: any) => cell.x === x && cell.y === y && cell.status !== 'killed');
}

export function randomAttack(ws: WebSocketId, data: any) {
   const { gameId, indexPlayer } = JSON.parse(data);
    const game = games.find(game => game.gameId === gameId);
    const player = game?.players.find(player => player.player.index === indexPlayer);
    let randomX, randomY;
    do {
        randomX = Math.floor(Math.random() * 10);
        randomY = Math.floor(Math.random() * 10);
    } while (player && isAttacked(randomX, randomY, player));
    
    const attackData = JSON.stringify({ gameId, x: randomX, y: randomY, indexPlayer});
    attackFeedback(ws, attackData);
}


function finishGame(ws: WebSocketId,game: any, indexPlayer: any) {
    const winner = players.find(player => player.index === indexPlayer) as Winner;
   if (winner) {
    winners.push({ name: winner.name, wins: winner.wins += 1 });
}
     const message = {
        type: "finish",
        data: JSON.stringify({
            winPlayer: indexPlayer,
        }),
        id: 0,
    };

     game.players.forEach((player: any) => {
        sendMessage(player.player.index, message);
     });
     players.forEach(player => {
          if(player.ws) updateWinners(player.ws);
     });
}