export interface IApiResponse<T> {
  ErrorMessages: string[];
  StatusCode: number;
  IsSuccess: boolean;
  result: T;
}