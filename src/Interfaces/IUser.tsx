export interface IUser {
  firstname?: string;
  lastname?: string;
  displayName: string;
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: string;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumber?: any;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd?: any;
  lockoutEnabled: boolean;
  accessFailedCount: number;
  role: string;
}

export interface IUserTest{
      id: string;
      displayName: string;
      userName: string; // mirror .NET mapping
      email: string;
      passwordHash: string;
      role: string;
}

export interface IUserRegister{
  DisplayName: string;
  Email: string;
  Password: string;
  Role: string;
}