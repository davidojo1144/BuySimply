import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Response } from 'express';
import {
  AuthenticatedRequest,
  AuthenticatedUser,
} from '../../auth/interfaces/authenticated-request.interface';
import { SessionService } from '../../auth/session.service';

@Injectable()
export class GlobalAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {}

  async use(
    request: AuthenticatedRequest,
    _response: Response,
    next: NextFunction,
  ) {
    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization token is required');
    }

    const token = authorization.replace('Bearer ', '').trim();
    if (!token) {
      throw new UnauthorizedException('Authorization token is required');
    }

    try {
      const payload =
        await this.jwtService.verifyAsync<AuthenticatedUser>(token);

      if (this.sessionService.isSessionRevoked(payload.jti)) {
        throw new UnauthorizedException('Session has been revoked');
      }

      if (!this.sessionService.isActiveSession(payload.email, payload.jti)) {
        throw new UnauthorizedException('Session is not active');
      }

      request.user = payload;
      request.token = token;
      next();
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
