const WebSocket = require('ws');
const GM = require('./controller/GameManager.js');

module.exports = (server) => {
    const wss = new WebSocket.Server({
        server
    });
 
    wss.on('connection', (ws, req) => GM.novaConexao(GM, ws, req));
 
    return wss;
}