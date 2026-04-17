import { AuthService } from './auth.service';
import type { LoginDto } from './dto/login.dto';
import type { AuthenticatedRequest } from './interfaces/authenticated-request.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(payload: LoginDto): Promise<{
        message: string;
        accessToken: string;
        staff: {
            id: number;
            name: string;
            email: string;
            role: import("./role.enum").Role;
        };
    }>;
    logout(request: AuthenticatedRequest): {
        message: string;
    };
}
