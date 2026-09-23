import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';

export interface JwtPayload {
  sub: string;
  email: string;
  companyId: string;
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  companyId: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordOk = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!passwordOk) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      companyId: user.companyId,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      tokenType: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        companyId: user.companyId,
        temporaryPassword: user.temporaryPassword,
        isActive: user.isActive,
      },
    };
  }
}