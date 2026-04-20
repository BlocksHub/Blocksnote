export class SessionExpiredError extends Error {
  constructor() {
    super("Your session has expired.");
    this.name = "AuthenticationError";
  }
}