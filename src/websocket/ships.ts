import { Game, WebSocketId, Ship } from "./interface.js";
import { games } from "./db.js";


export function addShips(ws: WebSocketId, data: any) {
  const { gameId, ships, indexPlayer } = JSON.parse(data);
    const game = games.find(game => game.gameId === gameId);
    const enemyPlayerIndex = game?.players.find(player => player.player.index !== indexPlayer)?.player.index;
    if (game) {
    game.currentPlayerIndex = indexPlayer;
    const player = game.players.find(player => player.player.index === indexPlayer);
  if (!player) {
    console.error('Player not found:', indexPlayer);
    return;
  }
    player.ships = ships;
    player.ships = ships.map((ship: Ship) => ({
      ...ship,
      hits: [],
      status: '',
    }));
      player.enemyShips = ships.map((ship: Ship) => ({
      x: null,
      y: null,
      hits: [],
      status: '',
    }));
  if (game.players.every(player => player.ships.length === 10) && enemyPlayerIndex !== undefined ) {
    startGame(game, enemyPlayerIndex, indexPlayer)
    console.log("Ships added for the players");
    }
  }
}

function startGame(game: Game, enemyPlayerIndex: number, indexPlayer: number) {
    game.players.forEach(currentPlayer  => {
    const response = {
      type: 'start_game',
      data: JSON.stringify({
        ships: currentPlayer.ships,
        currentPlayerIndex: game.currentPlayerIndex
      }),
      id: 0
    };
        currentPlayer.player.ws?.send(JSON.stringify(response));
       sendTurnInfo(game, enemyPlayerIndex, indexPlayer);  
    });
   console.log("Game started");
}

export function sendTurnInfo(game: Game, enemyPlayerIndex: number, indexPlayer: number) {
  game.currentPlayerIndex = game.currentPlayerIndex === indexPlayer ? enemyPlayerIndex : indexPlayer;
    const turnData = {
        type: "turn",
        data: JSON.stringify({
            currentPlayer: game.currentPlayerIndex 
        }),
        id: 0
    };

    game.players.forEach(player => {
        player.player.ws?.send(JSON.stringify(turnData));
    });
}