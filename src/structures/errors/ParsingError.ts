export class ParsingError extends Error {
    public type: number;
    public obj: unknown;

    constructor(t: number, o: unknown) {
        super("Unable to parse Object");
        this.name = "ParsingError";
        this.type = t
        this.obj = o
    }
}