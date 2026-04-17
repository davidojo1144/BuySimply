import { NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../../auth/interfaces/authenticated-request.interface';
import { SessionService } from '../../auth/session.service';
export declare class GlobalAuthMiddleware implements NestMiddleware {
    private readonly jwtService;
    private readonly sessionService;
    constructor(jwtService: JwtService, sessionService: SessionService);
    use(request: AuthenticatedRequest, _response: Response, next: NextFunction): Promise<void>;
}
