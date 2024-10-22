export class HttpException extends Error {
  public status: number;
  public message: string;
  public data?: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    Object.setPrototypeOf(this, HttpException.prototype);
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
