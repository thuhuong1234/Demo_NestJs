import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';
import { AuthGuard } from './guards/auth.guard';
import { Role, User } from '@prisma/client';
import { Roles } from '../../common/decorators/role.decorator';
import { AuthUser } from '../../common/decorators/auth-user.decorator';
import { Public } from '../../common/decorators/auth.decorator';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('register')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async findOne(@AuthUser() user: User) {
    return user;
  }
}
