import {expect} from 'chai';
import {MockSocket} from "./classes/mock-classes/MockSocket";
import {fake} from 'sinon';
import {messageHandler, nameChangeHandler} from "./event-handlers";

describe('messageHandler', function() {
    it('calls broadcast on the socket', function() {
        const _fake = fake();
        const mockSock = new MockSocket(_fake);
        messageHandler({message: ''}, mockSock);
        expect(_fake.calledOnce).to.be.true;
    });
    it('calls broadcast on the socket with correct arguments', function() {
        const _fake = fake();
        const mockSock = new MockSocket(_fake);
        messageHandler({message: ''}, mockSock);
        expect(_fake.calledWith('message', {message: ''})).to.be.true;
    });
});
describe('nameChangeHandler', function() {
    it('sets the username', function() {
        const arg = {username: ''};
        nameChangeHandler({username: 'test'}, arg);
        expect(arg.username).to.equal('test');
    })
});