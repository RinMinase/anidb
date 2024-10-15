export interface ErrorResponse {
  data: {
    data: {
      [key: string]: Array<string>;
    };
    status: number;
  };
}
