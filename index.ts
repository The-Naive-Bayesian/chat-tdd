import * as express from "express";
import * as http from "http";
import * as socketIo from "socket.io";

const port = 3000;

let app = express();
let server = new http.Server(app);
let io = socketIo(server);

server.listen(port, function() {
    console.log(`Listening on ${port}`);
});