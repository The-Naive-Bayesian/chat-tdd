import {SocketModel} from "../models/socket.model";
/*
    To keep things testable, we want to use DI with our socket.
    This allows us to mock the socket.io objects and test our methods.
    We create a class here that is instantiated on connection and contains event handling logic.
 */

export class ChatSession {
    constructor(
        private socket: SocketModel,
        callback: (data: any, socket: any) => void,
        public username: string
    ) {
        socket.on('message', (data) => {
            callback(data, socket)
        });
    }
}