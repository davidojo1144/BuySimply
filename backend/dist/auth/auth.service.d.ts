import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Role } from './role.enum';
import { SessionService } from './session.service';
export declare class AuthService {
    private readonly jwtService;
    private readonly sessionService;
    private readonly staffs;
    constructor(jwtService: JwtService, sessionService: SessionService);
    login(payload: LoginDto): Promise<{
        message: string;
        accessToken: string;
        staff: {
            id: number;
            name: string;
            email: string;
            role: Role;
        };
    }>;
    logout(email: string, jti: string): {
        message: string;
    };
}
