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

### Stage 2: [Handle messages](https://github.com/The-Naive-Bayesian/chat-tdd/tree/48dde4c2061f10a971a83563d902f521efa987ce)
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


### Stage 3: [Broadcasting](https://github.com/The-Naive-Bayesian/chat-tdd/tree/e8f37336f191b896107c4ab135e77f6ae4f3834f)
Now that we have events passing data to callbacks, we will want to broadcast messages out to the world!
With `socket.io` the `Socket` can broadcasts events to other sockets.
Because of this, we will want to reference the `Socket` inside of our callbacks,
and to do that, we'll need to pass the socket into the callback.


#### WIP: Socket passed to callback
In order to test this, we will need to ensure sockets are passed in to listener callbacks.

To test that the `ChatSession` passes the `Socket` into the callback correctly, we might test it like this:

    it('should pass the socket as the second argument to the "message" event', function(done) {
        const _socket = new MockSocket;
        const callback: (data: {message: string}, socket: any) => void = (data, socket) => {
            expect(socket).to.equal(_socket);
            done();
        };
        new ChatSession(_socket, callback);
        _socket.emit('message', {message: 'hello, world'});
    });

This ensures that the `Socket` in the callback refers to the same `Socket` passed into the `ChatSession` constructor.

#### WIP: Split out callbacks
Now that we have the `Socket` available to the callback, we'll want to broadcast messages with it.
To ensure we broadcast things correctly, we'll want to test our callbacks.

So far, however, we've built our callbacks as part of our tests - we can't test something that we define in the test!
At this point, then, we want to split out our callbacks into a separate module so we can test the callbacks themselves.

Eventually our message callback will invoke the `broadcast.emit` method of our `Socket`,
but for now we will just build up the skeleton without implementing behavior, so we can build a failing
(but TS-compilable) test. We also allow our mock sockets to accept fakes for `broadcast.emit` so we can more easily
test if and how that has been invoked.

Now we're ready to write our failing test:

    describe('messageHandler', function() {
        it('calls broadcast on the socket', function() {
            const _fake = fake();
            const mockSock = new MockSocket(_fake);
            messageHandler({message: ''}, mockSock);
            expect(_fake.calledOnce).to.be.true;
        });
    });
 
 After we add a passing implementation, we're ready for the next and final step of building our simple server.

### Stage 4: Who's talking?
Being able to send messages is great, but how do we know who's saying what?
For our final step, we want to assign new connections a unique guest name,
and allow users to set their username in a new socket event.

#### Usernames
For new connections we will start by assigning them a name "Guest #",
where '#' will be the total number of past and present connections to the server as of their connection.
This will be a property of the `Socket`, since it will persist on a per-connection basis.

Let's start by testing that a new `ChatSession` object is provided a username:

        it('should have a string username property', function() {
            const socket = new MockSocket;
            const session = new ChatSession(socket, ()=>{});
            expect(typeof session.username).to.equal('string');
        });

This should fail since no `username` is ever assigned.

The basic fix is simple: assign some constant `username` in the `ChatSession` constructor!
This makes the test pass, but opens the next question: can we get unique usernames between connections?
Our new test tells us this simple approach won't work:

        it('should not have the same username shared by two instances', function() {
            const socket = new MockSocket;
            const session1 = new ChatSession(socket, ()=>{});
            const session2 = new ChatSession(socket, ()=>{});
            expect(session1.username).to.not.equal(session2.username);
        });

This now fails.

#### Unique usernames
While we could approach this problem in a number of ways
(a static counter property of ChatSession comes to mind,
though [static things are hard to test](http://misko.hevery.com/2008/12/15/static-methods-are-death-to-testability/)),
in keeping with the theme of dependency injection we choose to let the creator of a ChatSession instance
decide what to name it by passing the username in the constructor.

A quick refactor later and our unique username test looks like this:

        it('should not force the same username to be shared by two instances', function() {
            const socket = new MockSocket;
            const session1 = new ChatSession(socket, ()=>{}, 'Guest 1');
            const session2 = new ChatSession(socket, ()=>{}, 'Guest 2');
            expect(session1.username).to.not.equal(session2.username);
        });

Easy, right? This may seem trivial, but that's a good thing - there's no reason to make things more
complicated than they need to be, and if we need to we can test whatever builds these chat sessions to ensure
unique usernames are passed in.

#### Custom usernames
Now we want to allow users to provide their own, custom usernames. We will do this through a new 'name change' event.
This will involve a change to our ChatSession as well as a new event handler in `event-handlers.ts`.

For the `ChatSession` we can mostly reuse tests from the 'message' event and modify them to fit the 'name change' event.
To test the new event handler we will need to write a new test, but it should be straightforward:

    describe('nameChangeHandler', function() {
        it('sets the username', function() {
            const arg = {username: ''};
            nameChangeHandler({username: 'test'}, arg);
            expect(arg.username).to.equal('test');
        })
    });

Once we implement these changes, our chat server should be ready to rock!
