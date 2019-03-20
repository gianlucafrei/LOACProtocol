"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProtocolException extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = "Protocol Error";
        this.stack = new Error().stack;
    }
}
exports.ProtocolException = ProtocolException;
class PreconditionException extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = "Precondition Error";
        this.stack = new Error().stack;
    }
}
exports.PreconditionException = PreconditionException;
//# sourceMappingURL=exceptions.js.map