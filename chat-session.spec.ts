import {ChatSession} from "./chat-session";
import {expect} from 'chai';
import * as EventEmitter from 'events';
import {fake} from 'sinon';

class MockSocket extends EventEmitter {
    broadcast = {emit: this.emit}
}

describe('ChatSession', function() {
    it('should build', function() {
        const socket = new MockSocket;
        new ChatSession(socket, ()=>{});
    });
    it('should invoke callback on "message" event', function(done) {
        const socket = new MockSocket;
        const _fake = fake();
        const callback: (data) => void = (data) => {
            _fake();
            expect(_fake.called).to.be.true;
            done();
        };
        new ChatSession(socket, callback);
        socket.emit('message');
    });
    it('should invoke callback with "data" object argument on "message" event', function(done) {
        const socket = new MockSocket;
        const callback: (data: any) => void = (data) => {
            expect(typeof data).to.equal('object');
            done();
        };
        new ChatSession(socket, callback);
        socket.emit('message', {});
    });
    it('"message" event "data" argument should contain string property "message"', function(done) {
        const socket = new MockSocket;
        const callback: (data: {message: string}) => void = (data) => {
            expect(typeof data.message).to.equal('string');
            done();
        };
        new ChatSession(socket, callback);
        socket.emit('message', {message: 'hello, world'});
    });
    it('should pass the socket as the second argument to the "message" event', function(done) {
        const _socket = new MockSocket;
        const callback: (data: {message: string}, socket: any) => void = (data, socket) => {
            expect(socket).to.equal(_socket);
            done();
        };
        new ChatSession(_socket, callback);
        _socket.emit('message', {message: 'hello, world'});
    });
});