import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';
import { PrismaService } from 'prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async signUp(signUpDto: SignUpDto) {
    try {
      const { id, password, email, name } = signUpDto;
      const user = await this.prismaService.user.findUnique({
        where: {
          email: signUpDto.email,
        },
      });

      const saltOrRounds = 10;
      const hashPassword = await bcrypt.hash(password, saltOrRounds);
      const newUser = await this.prismaService.user.create({
        data: {
          email: email,
          name: name,
          password: hashPassword,
        },
      });

      const payload = { userId: user.id };

      const accessToken = await this.jwtService.signAsync(payload);
      return {
        accessToken,
      };
      return newUser;
    } catch (error) {
      if (error.code === 'P2002') {
        if (error.meta.target === 'User_email_key')
          throw new BadRequestException('Email is existed');
      }
    }
  }
  async signIn(signInDto: SignInDto) {
    const { name, password } = signInDto;
    const user = await this.prismaService.user.findFirst({
      where: {
        email: signInDto.email,
      },
    });
    if (!user) {
      throw new Notification('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }
    const payload = { userId: user.id };

    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
    };
  }
}
