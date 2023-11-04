import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';
import { PrismaService } from 'prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignTokenPayload } from 'src/common/types';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async signUp(signUpDto: SignUpDto) {
    try {
      const { password, email, name } = signUpDto;

      const saltOrRounds = 10;
      const hashPassword = await bcrypt.hash(password, saltOrRounds);
      const newUser = await this.prismaService.user.create({
        data: {
          email,
          name,
          password: hashPassword,
        },
      });

      const payload = { userId: newUser.id };
      const accessToken = await this.generationAccessToken(payload);

      return {
        accessToken,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        if (error.meta.target === 'User_email_key')
          throw new BadRequestException('Email is existed');
      }
    }
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    const payload = { userId: user.id };
    const accessToken = await this.generationAccessToken(payload);
    return {
      accessToken,
    };
  }

  async generationAccessToken(payload: SignTokenPayload) {
    const secret = this.configService.get<string>('jwt.secret');
    const expiresIn = this.configService.get<string>('jwt.expiresIn');

    const options = {
      secret,
      expiresIn,
    };

    return this.jwtService.signAsync(payload, options);
  }
}
