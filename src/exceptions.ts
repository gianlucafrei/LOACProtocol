/**
 * Represents an error while executing a protocol method.
 * This type of error should be thrown if any test fails
 * or in case of a protocol violation by another party.
 */
export class ProtocolException extends Error {

  constructor(public message: string) {
    super(message);
    this.name = "Protocol Error";
    this.stack = (<any>new Error()).stack;
  }
}

export class PreconditionException extends Error {

  constructor(public message: string) {
    super(message);
    this.name = "Precondition Error";
    this.stack = (<any>new Error()).stack;
  }
}