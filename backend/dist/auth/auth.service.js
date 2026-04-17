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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const session_service_1 = require("./session.service");
let AuthService = class AuthService {
    jwtService;
    sessionService;
    staffs;
    constructor(jwtService, sessionService) {
        this.jwtService = jwtService;
        this.sessionService = sessionService;
        const raw = (0, node_fs_1.readFileSync)((0, node_path_1.join)(process.cwd(), 'data', 'staffs.json'), 'utf8');
        this.staffs = JSON.parse(raw);
    }
    async login(payload) {
        const email = payload.email?.trim().toLowerCase();
        const password = payload.password?.trim();
        if (!email || !password) {
            throw new common_1.BadRequestException('Email and password are required');
        }
        const staff = this.staffs.find((item) => item.email.toLowerCase() === email);
        if (!staff || staff.password !== password) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const jti = this.sessionService.issueSession(staff.email);
        const accessToken = await this.jwtService.signAsync({
            sub: staff.id,
            email: staff.email,
            role: staff.role,
            jti,
        });
        return {
            message: 'Login successful',
            accessToken,
            staff: {
                id: staff.id,
                name: staff.name,
                email: staff.email,
                role: staff.role,
            },
        };
    }
    logout(email, jti) {
        this.sessionService.revokeSession(email, jti);
        return { message: 'Logout successful' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        session_service_1.SessionService])
], AuthService);
//# sourceMappingURL=auth.service.js.map