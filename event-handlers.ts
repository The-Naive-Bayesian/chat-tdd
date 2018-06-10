import {SocketModel} from "./models/socket.model";

export const messageHandler = (
    data: {message: string},
    socket: SocketModel
): void => {
    socket.broadcast.emit('message', data);
};