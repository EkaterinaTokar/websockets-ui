import { httpServer } from "./src/http_server/index.js";
import { wsServer } from "./src/websocket/wsserver.js"

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const WS_PORT = 3000;

wsServer.on('listening', () => {
  console.log(`WebSocket server is listening on port ${WS_PORT}`);
});