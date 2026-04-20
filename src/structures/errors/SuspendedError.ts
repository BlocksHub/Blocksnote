export class SuspendedError extends Error {
  constructor() {
    super("Your IP has been suspended.");
    this.name = "AuthenticationError";
  }
}