export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: number;
  username: string;
  password: string;
  role: Role;
  createdAt: Date;
}
