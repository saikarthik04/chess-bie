

import { WebSocketServer } from 'ws';
import { gameController } from './gameController';
const ws = new WebSocketServer({ port: 8080 });

const game = new gameController();

ws.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        game.addUsers(ws,data)
    });
    ws.on('disconnect', () =>game.removeFromGame(ws));
});
