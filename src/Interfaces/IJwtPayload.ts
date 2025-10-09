export interface IJwtPayload {
  displayName: string;
  role: string;
  exp: number; // expiration timestamp
  iat?: number; // issued at (optional)
}