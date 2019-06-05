# UniLib (for JavaScript)

UniLib is a utility library for writing scalable JavaScript applications on the client and server. It's intended to be lightweight and flexible.

The initial version of UniLib includes:

| Class       | Description                                                                                                    |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| URegistry   | A generic key-value registry with lazy initialization and IoC (dependency injection) capabilities              |
| uglobal     | A global instance of URegistry which can be favored over adding properties to the global object (e.g., window) |
| UBus        | An in-memory message bus, with support for wildcard topics                                                     |
| UDisptacher | A generic dispatcher, which dispatches to handler functions by name                                            |
| ULogger     | A generic logger whose appender implementation can be specified at instantiation                               |
| UError      | A generic error class with support for a context object                                                        |

Notes:

- This library is written in TypeScript and compiled to ES6-compatible JavaScript.
