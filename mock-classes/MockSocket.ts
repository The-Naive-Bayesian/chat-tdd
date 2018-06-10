import {EventEmitter} from 'events';

export class MockSocket extends EventEmitter {
    broadcast: {emit: (event: string | symbol, ...args: any[]) => boolean};

    constructor(broadcastEmit?: (event: string | symbol, ...args: any[]) => boolean) {
        super();
        if (broadcastEmit) {
            this.broadcast.emit = broadcastEmit;
        } else {
            this.broadcast.emit = this.emit;
        }
    }
}
