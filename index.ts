import * as express from "express";
import * as http from "http";
import * as socketIo from "socket.io";
import {ChatSession} from "./classes/chat-session";
import {messageHandler, nameChangeHandler} from "./event-handlers";

const port = 3000;

let app = express();
let server = new http.Server(app);
let io = socketIo(server);

// Track # connections in server instance to generate guest usernames
let connectionCount = 0;

io.on('connection', (socket) => {
    connectionCount += 1;
    new ChatSession(socket, messageHandler, nameChangeHandler, `Guest ${connectionCount}`);
});

server.listen(port, function() {
    console.log(`Listening on ${port}`);
});