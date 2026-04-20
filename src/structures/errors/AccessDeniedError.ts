export class AccessDeniedError extends Error {
  constructor() {
    super("Access to this resource has been denied.");
    this.name = "AuthenticationError";
  }
}