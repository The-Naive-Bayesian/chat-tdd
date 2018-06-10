export interface SocketModel {
    on: (
        event: string,
        callback: (data: any) => void
    ) => void;
    emit: (
        event: string,
        ...args: any[]
    ) => void;
    broadcast: {
        emit: (event: string, ...args: any[]) => void;
    };
}