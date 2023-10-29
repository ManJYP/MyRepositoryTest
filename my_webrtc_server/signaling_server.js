const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Set();

wss.on('connection', (ws) => {
    // New client connection
    clients.add(ws);

    // Receive and relay messages from clients
    ws.on('message', (message) => {
        for (const client of clients) {
            if (client !== ws) {
                client.send(message);
            }
        }
    });

    // Handle client disconnection
    ws.on('close', () => {
        clients.delete(ws);
    });
});

server.listen(8080, () => {
    console.log('Signaling server is running on port 8080');
});
