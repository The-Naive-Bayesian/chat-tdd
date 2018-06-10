import * as express from "express";
import * as http from "http";
import * as socketIo from "socket.io";
import {ChatSession} from "./chat-session";

const port = 3000;

let app = express();
let server = new http.Server(app);
let io = socketIo(server);

io.on('connection', (socket) => {
    new ChatSession(socket, (data: {message: string}, socket: any): void => {
        socket.broadcast.emit('message', data);
    });
});

server.listen(port, function() {
    console.log(`Listening on ${port}`);
});