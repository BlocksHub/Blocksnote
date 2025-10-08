export class Response<T> {
  constructor(
    public headers: Record<string, string>,
    public status: number,
    public data: T
  ){}
  
  public header(key: string): string | undefined {
    return this.headers[key.toLowerCase()];
  }
}