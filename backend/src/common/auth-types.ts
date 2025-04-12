export type UserRequest = {
  sub: number;
  username: string;
  iat: number;
  exp: number;
};

export interface RequestWithUAT extends Request {
  user: UserRequest;
}
