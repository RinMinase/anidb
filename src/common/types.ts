export interface ErrorResponse {
  data: {
    [key: string]: Array<string>;
  };
  status: number;
}
