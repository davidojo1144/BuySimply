import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

@Injectable()
export class SessionService {
  private readonly activeSessions = new Map<string, string>();
  private readonly revokedSessionIds = new Set<string>();

  issueSession(email: string): string {
    const jti = randomUUID();
    this.activeSessions.set(email.toLowerCase(), jti);
    return jti;
  }

  revokeSession(email: string, jti: string): void {
    this.activeSessions.delete(email.toLowerCase());
    this.revokedSessionIds.add(jti);
  }

  isSessionRevoked(jti: string): boolean {
    return this.revokedSessionIds.has(jti);
  }

  isActiveSession(email: string, jti: string): boolean {
    return this.activeSessions.get(email.toLowerCase()) === jti;
  }
}
