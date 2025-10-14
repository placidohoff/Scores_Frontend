export interface IAuth {
  displayName: string;
  id: string;
  email: string;
  role: 'admin' | 'user' | 'moderator' | string; // extend as needed
  nbf: number; // "not before" timestamp (JWT standard claim)
}