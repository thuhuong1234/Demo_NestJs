import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signUp.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
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

      const payload = { userId: newUser.id };
      console.log(payload);
      const accessToken = await this.jwtService.signAsync(payload);
      console.log(accessToken);
      return accessToken;
    } catch (error) {
      console.log(error);
      if (error.code === 'P2002') {
        if (error.meta.target === 'User_email_key')
          throw new BadRequestException('Email is existed');
      }
    }
  }
}
