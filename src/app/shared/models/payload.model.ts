export interface GetPayload<T> {
  errorCode: number;
  taggedAs: string;
  dataCount: number;
  data: T;
}
