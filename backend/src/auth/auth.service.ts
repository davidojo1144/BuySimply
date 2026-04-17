import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { LoginDto } from './dto/login.dto';
import { Role } from './role.enum';
import { SessionService } from './session.service';

type StaffRecord = {
  id: number;
  name: string;
  email: string;
  role: Role;
  password: string;
};

@Injectable()
export class AuthService {
  private readonly staffs: StaffRecord[];

  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {
    const raw = readFileSync(
      join(process.cwd(), 'data', 'staffs.json'),
      'utf8',
    );
    this.staffs = JSON.parse(raw) as StaffRecord[];
  }

  async login(payload: LoginDto) {
    const email = payload.email?.trim().toLowerCase();
    const password = payload.password?.trim();

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const staff = this.staffs.find(
      (item) => item.email.toLowerCase() === email,
    );

    if (!staff || staff.password !== password) {
      throw new UnauthorizedException('Invalid email or password');
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

  logout(email: string, jti: string) {
    this.sessionService.revokeSession(email, jti);
    return { message: 'Logout successful' };
  }
}
