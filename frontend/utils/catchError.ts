import { HttpException } from "./HttpException";

export const catchError = <T>(promise: Promise<T>): Promise<[undefined, T] | [HttpException]> => {
  return promise
    .then(data => { return [undefined, data] as [undefined, T] })
    .catch(error => { return [error as HttpException] });
};
