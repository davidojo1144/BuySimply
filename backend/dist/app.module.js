"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const throttler_1 = require("@nestjs/throttler");
const auth_controller_1 = require("./auth/auth.controller");
const auth_service_1 = require("./auth/auth.service");
const roles_guard_1 = require("./auth/roles.guard");
const session_service_1 = require("./auth/session.service");
const global_auth_middleware_1 = require("./common/middleware/global-auth.middleware");
const loans_controller_1 = require("./loans/loans.controller");
const loans_service_1 = require("./loans/loans.service");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(global_auth_middleware_1.GlobalAuthMiddleware)
            .exclude({ path: 'login', method: common_1.RequestMethod.POST })
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET ?? 'buy-simply-secret',
                signOptions: { expiresIn: '1h' },
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60_000,
                    limit: 100,
                },
            ]),
        ],
        controllers: [auth_controller_1.AuthController, loans_controller_1.LoansController],
        providers: [
            auth_service_1.AuthService,
            loans_service_1.LoansService,
            session_service_1.SessionService,
            roles_guard_1.RolesGuard,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map