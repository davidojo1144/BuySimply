export declare class SessionService {
    private readonly activeSessions;
    private readonly revokedSessionIds;
    issueSession(email: string): string;
    revokeSession(email: string, jti: string): void;
    isSessionRevoked(jti: string): boolean;
    isActiveSession(email: string, jti: string): boolean;
}
