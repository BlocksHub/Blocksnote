export class RateLimitError extends Error {
  constructor() {
    super("You have been ratelimited");
    this.name = "AuthenticationError";
  }
}