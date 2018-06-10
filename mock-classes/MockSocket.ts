import {EventEmitter} from 'events';

export class MockSocket extends EventEmitter {
    broadcast = {emit: this.emit}
}
