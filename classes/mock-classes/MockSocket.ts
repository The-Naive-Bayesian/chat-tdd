import {EventEmitter} from 'events';

export class MockSocket extends EventEmitter {
    broadcast: {
        emit: (event: string | symbol, ...args: any[]) => boolean
    } = {
        emit: this.emit
    };

    constructor(broadcastEmit?: (event: string | symbol, ...args: any[]) => boolean) {
        super();
        if (broadcastEmit) {
            this.broadcast.emit = broadcastEmit;
        }
    }
}
