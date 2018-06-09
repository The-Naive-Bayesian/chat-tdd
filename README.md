# Test-driven Development Chat Example
## Overview
This project uses [test-driven development (TDD)](https://msdn.microsoft.com/en-us/library/aa730844(v=vs.80).aspx) to build a basic chat server using Socket.io.
You can look through past PRs and commits to see the process by which it gets built up. A summary of this process is
described later in this document.

Our project uses `socket.io` and `express`. For testing we use `mocha`, `chai`, and `sinon`. 

## The stages
### Stage 0: [A do-nothing server](https://github.com/The-Naive-Bayesian/chat-tdd/blob/ab8b795108eb03211b7a40e0baa326066b702509/index.ts)
We want to start by building the equivalent of a `main()` function: put the pieces together to run a server and start
it on a port.

Since we're only hooking pieces together in this part, [we don't need to unit test yet](
http://misko.hevery.com/2008/08/29/my-main-method-is-better-than-yours/).

### Stage 1: [Add a chat session handler](https://github.com/The-Naive-Bayesian/chat-tdd/tree/a059036426a5dcfc0d583fdd34cb11d5aa5b4962)
When a user connects to our chat server we begin a session.

When a new connection is made we have the opportunity to define callbacks for client events. Rather than define and pass
in callbacks inside `index.ts`, we will instead define event handling logic inside a new class file, `chat-session.ts`.

By defining our event handling outside of `index.ts` we keep that file small and free from business logic we will want
to test.

#### Our first tests
Inside our new `chat-session.ts` file we create a class that accepts a single contstructor
argument - `private socket: any` -which is the `socket` object from the socketIo 'connect' event.
Although this only assigns `socket` as a property of our new class, this is enough to start.


Next, in `chat-session.spec.ts` we test that our new class can instantiate when passed an empty object `{}`.
It turns out it can, and we can now confidently use this class in `index.ts`:

    io.on('connection', (socket) => {
        new ChatSession(socket);
    });

### Stage 2: Handle messages
A chat server that doesn't support messages isn't really a chat server, so it's time to make messages work!
With socket.io the Socket [acts very similarly to an EventEmitter](https://socket.io/docs/server-api/#socket),
so we can use that as our mental model for how to mock out a Socket for now.

#### Beginnings
To start, we create tests to ensure that our `ChatSession` class correctly attaches listeners to our Socket.
Since our Socket uses async events and listeners, we use Mocha's option to pass a `done` function to
a test that signals when an async test is complete.

Here's an example of how to test that the 'message' event calls the callback:

    it('should invoke callback on "message" event', function(done) {
        const socket = new EventEmitter;
        const _fake = fake();
        const callback: () => void = () => {
            _fake();
            expect(_fake.called).to.be.true;
            done();
        };
        new ChatSession(socket, callback);
        socket.emit('message');
    });
    
To make this test pass we need to update our `ChatSession` class to hook up listeners to our `Socket`:

    export class ChatSession {
        constructor(
            private socket: {
                on: (event: string, callback: () => void) => void
            },
            callback: () => void
        ) {
            socket.on('message', callback);
        }
    }

#### Event data tests
Message events should have messages! Luckily it's simple to build on our previous tests to ensure message data is
passed through correctly.

Here's an example of a test to ensure message data is passed to the 'message' callback.

    it('should invoke callback with "data" object argument on "message" event', function(done) {
        const socket = new EventEmitter;
        const callback: (data: any) => void = (data) => {
            expect(typeof data).to.equal('object');
            done();
        };
        new ChatSession(socket, callback);
        socket.emit('message', {});
    });
