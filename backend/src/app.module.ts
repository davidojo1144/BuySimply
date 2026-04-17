import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { RolesGuard } from './auth/roles.guard';
import { SessionService } from './auth/session.service';
import { GlobalAuthMiddleware } from './common/middleware/global-auth.middleware';
import { LoansController } from './loans/loans.controller';
import { LoansService } from './loans/loans.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'buy-simply-secret',
      signOptions: { expiresIn: '1h' },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 100,
      },
    ]),
  ],
  controllers: [AuthController, LoansController],
  providers: [
    AuthService,
    LoansService,
    SessionService,
    RolesGuard,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GlobalAuthMiddleware)
      .exclude({ path: 'login', method: RequestMethod.POST })
      .forRoutes('*');
  }
}
