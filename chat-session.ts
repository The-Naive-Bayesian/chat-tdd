/*
    To keep things testable, we want to use DI with our socket.
    This allows us to mock the socket.io object and test our methods.
    We create a class here that is instantiated on connection and contains event handling logic.
 */
export class ChatSession {
    io: any;
    constructor(io: any) {
        this.io = io;
    }
}