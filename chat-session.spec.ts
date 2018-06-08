import {ChatSession} from "./chat-session";
import {expect} from 'chai';

describe('ChatSession', function() {
    it('should build', function() {
        const socket = {};
        new ChatSession(socket);
    });
});