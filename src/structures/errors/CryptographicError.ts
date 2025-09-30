export class CryptographicError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CryptographicError";
    }
}