"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalAuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const session_service_1 = require("../../auth/session.service");
let GlobalAuthMiddleware = class GlobalAuthMiddleware {
    jwtService;
    sessionService;
    constructor(jwtService, sessionService) {
        this.jwtService = jwtService;
        this.sessionService = sessionService;
    }
    async use(request, _response, next) {
        const authorization = request.headers.authorization;
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Authorization token is required');
        }
        const token = authorization.replace('Bearer ', '').trim();
        if (!token) {
            throw new common_1.UnauthorizedException('Authorization token is required');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token);
            if (this.sessionService.isSessionRevoked(payload.jti)) {
                throw new common_1.UnauthorizedException('Session has been revoked');
            }
            if (!this.sessionService.isActiveSession(payload.email, payload.jti)) {
                throw new common_1.UnauthorizedException('Session is not active');
            }
            request.user = payload;
            request.token = token;
            next();
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
};
exports.GlobalAuthMiddleware = GlobalAuthMiddleware;
exports.GlobalAuthMiddleware = GlobalAuthMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        session_service_1.SessionService])
], GlobalAuthMiddleware);
//# sourceMappingURL=global-auth.middleware.js.map