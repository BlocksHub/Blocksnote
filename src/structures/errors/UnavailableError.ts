export class UnavailableError extends Error {
  constructor() {
    super("This resource is unavailable.");
    this.name = "AuthenticationError";
  }
}