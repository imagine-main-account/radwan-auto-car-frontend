/** Every API response is wrapped as `{ data, message? }`. */
export type ApiResponse<T> = {
  data: T;
  message?: string;
};
