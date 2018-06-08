# Test-driven Development Chat Example
## Overview
This project uses test-driven development (TDD) to build a basic chat server using Socket.io.
You can look through past PRs and commits to see the process by which it gets built up. A summary of this process is
described later in this document.

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
```
io.on('connection', (socket) => {
    new ChatSession(socket);
});
```