import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateUserDto) {
    try {
      const newUser = await this.prisma.user.create({
        data,
      });
      return newUser;
    } catch (error) {
      if (error.code === 'P2002') {
        if (error.meta.target === 'User_email_key')
          throw new NotFoundException('Email existed');
      }
    }
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        email: true,
        password: true,
        avatar: true,
        usersAndClasses: {
          select: {
            class: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const updateUser = await this.prisma.user.update({
        where: {
          id,
        },
        data: updateUserDto,
      });

      return updateUser;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      if (error.code === 'P2002') {
        if (error.meta.target === 'User_email_key')
          throw new NotFoundException('Email existed');
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
