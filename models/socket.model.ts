export interface SocketModel {
    on: (
        event: string | symbol,
        callback: (data: any) => void
    ) => void;
    emit: (
        event: string | symbol,
        ...args: any[]
    ) => void;
    broadcast: {
        emit: (event: string | symbol, ...args: any[]) => void;
    };
}