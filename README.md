# The Unilib Library

Unilib is a general utility library for writing scalable JavaScript applications. It's intended to be lightweight, flexible, à la carte (i.e., install/import only what you need), and it strives to be mostly isomorphic/universal (i.e., can be used client-side or server-side).

Unilib includes the following modules:

| Class     | Sub-Package                                                      | Description                                                                                                                                          |
| --------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| UError    | [unilib-error](https://www.npmjs.com/package/unilib-error)       | A generic error class with support for supplying arbitrary instance properties which may provide additional context about the error that has occured |
| URegistry | [unilib-registry](https://www.npmjs.com/package/unilib-registry) | A generic key-value registry with lazy initialization and IoC (dependency injection) capabilities                                                    |
| ULogger   | [unilib-logger](https://www.npmjs.com/package/unilib-logger)     | A generic logger whose appender implementation can be specified via the constructor when instantiated                                                |
| UBus      | [unilib-bus](https://www.npmjs.com/package/unilib-bus)           | An in-memory message bus with support for wildcard topics                                                                                            |

Notes:

- All modules in this library are written in TypeScript and compiled to ES6-compatible JavaScript
- While every module in this library has 100% unit test coverage and is being used in Production at a few companies, at this time, we cannot guarantee long-term support
