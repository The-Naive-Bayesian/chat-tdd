import {ChatSession} from "./chat-session";
import {expect} from 'chai';
import * as EventEmitter from 'events';
import {fake} from 'sinon';

describe('ChatSession', function() {
    it('should build', function() {
        const socket = {on: (event, callback)=>{}};
        new ChatSession(socket, ()=>{});
    });
    it('should invoke callback on "message" event', function(done) {
        const socket = new EventEmitter;
        const _fake = fake();
        const callback = () => {
            _fake();
            expect(_fake.calledOnce).to.be.true;
            done();
        };
        new ChatSession(socket, callback);
        socket.emit('message');
    });
    it('should be true', function() {
        const _fake = fake();
        _fake();
        expect(_fake.calledOnce).to.be.true;
    });
});