export class NetworkError extends Error {
    public readonly code: number;

    constructor(message: string, code: number) {
        super(message);
        this.name = "NetworkError";
        this.code = code
    }
}