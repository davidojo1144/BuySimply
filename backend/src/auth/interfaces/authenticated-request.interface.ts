import { Request } from 'express';
import { Role } from '../role.enum';

export interface AuthenticatedUser {
  sub: number;
  email: string;
  role: Role;
  jti: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
  token?: string;
}
