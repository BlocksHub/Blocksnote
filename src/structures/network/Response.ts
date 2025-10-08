import { Parser } from "../parsing/Parser";

export class Response<T> {
  constructor(
    public headers: Record<string, string>,
    public status: number,
    public data: T
  ){
    this.data = Parser.parse(data);
  }
  
  public header(key: string): string | undefined {
    return this.headers[key.toLowerCase()];
  }
}