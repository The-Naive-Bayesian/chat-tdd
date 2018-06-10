import {expect} from 'chai';
import {MockSocket} from "./mock-classes/MockSocket";
import {fake} from 'sinon';
import {messageHandler} from "./event-handlers";

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
