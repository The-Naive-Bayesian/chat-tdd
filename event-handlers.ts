import {SocketModel} from "./models/socket.model";
import {NameChangeEventModel} from "./models/name-change-event.model";
import {MessageEventModel} from "./models/message-event.model";
import {ChatSession} from "./classes/chat-session";

export const messageHandler = (
    data: MessageEventModel,
    socket: SocketModel
): void => {
    socket.broadcast.emit('message', data);
};

export const nameChangeHandler = (data: NameChangeEventModel, session: {username: string}) => {
    // session.username = data.username;
};