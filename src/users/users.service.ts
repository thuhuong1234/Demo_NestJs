import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma.service';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (user) {
      throw new NotFoundException();
    }

    return this.prisma.user.create({
      data,
    });
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        class: {
          select: {
            nameClass: true,
            memberOfClass: true,
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }

    const updateUser = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: updateUserDto,
    });
    return updateUser;
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return this.prisma.user.delete({
      where: { id: id },
    });
  }
}
