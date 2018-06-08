import {ChatSession} from "./chat-session";

describe('ChatSession', function() {
    it('should build', function() {
        const io = {};
        new ChatSession(io);
    });
});