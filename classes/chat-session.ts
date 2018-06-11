import {SocketModel} from "../models/socket.model";
import {MessageEventModel} from "../models/message-event.model";
import {NameChangeEventModel} from "../models/name-change-event.model";
/*
    To keep things testable, we want to use DI with our socket.
    This allows us to mock the socket.io objects and test our methods.
    We create a class here that is instantiated on connection and contains event handling logic.
 */

export class ChatSession {
    constructor(
        private socket: SocketModel,
        messageHandler: (data: MessageEventModel, socket: SocketModel) => void,
        nameChangeHandler: (data: NameChangeEventModel, session: ChatSession) => void,
        public username: string
    ) {
        socket.on('message', (data: MessageEventModel) => {
            messageHandler(data, socket)
        });
        socket.on('name change', (data) => {
            nameChangeHandler(data, this);
        })
    }
}