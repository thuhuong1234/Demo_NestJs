import { Role } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 16)
  password: string;

  userRole?: Role;

  avatar?: string;
}
