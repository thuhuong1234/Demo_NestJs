import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { PrismaService } from 'prisma.service';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateClassDto) {
    try {
      const newClass = await this.prisma.class.create({ data });
      return newClass;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Class existed!');
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    const classes = await this.prisma.class.findMany();
    return classes;
  }

  async findOne(id: number) {
    const result = await this.prisma.class.findUnique({
      where: { id },
      select: {
        nameClass: true,
        memberOfClass: true,
        usersAndClasses: {
          select: {
            user: true,
          },
        },
      },
    });
    if (!result) {
      throw new NotFoundException('Class not found');
    }
    return result;
  }

  async update(id: number, updateClassDto: UpdateClassDto) {
    try {
      const updateClass = await this.prisma.class.update({
        where: { id },
        data: updateClassDto,
      });
      return updateClass;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Class not found');
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    const result = await this.prisma.class.findUnique({
      where: { id },
    });
    if (!result) throw new NotFoundException('Class not found');
    return this.prisma.class.delete({
      where: {
        id,
      },
    });
  }

  async addUserToClass(classId: number, userId: number) {
    try {
      const userToClass = await this.prisma.usersAndClasses.create({
        data: {
          classId: classId,
          userId: userId,
        },
      });
      return userToClass;
    } catch (error) {
      if (error.code === 'P2003') {
        if (error.meta.field_name === 'userId')
          throw new NotFoundException('This user not found');
        if (error.meta.field_name === 'classId')
          throw new NotFoundException('This class not found');
      }
      if (error.code === 'P2002')
        throw new BadRequestException('This user existed');
    }
  }
  async removeUserFromClass(classId: number, userId: number) {
    try {
      const userToClass = await this.prisma.usersAndClasses.delete({
        where: {
          userId_classId: {
            classId: classId,
            userId: userId,
          },
        },
      });
      return userToClass;
    } catch (error) {
      if (error.code === 'P2003') {
        if (error.meta.field_name === 'userId')
          throw new NotFoundException('This user not found');
        if (error.meta.field_name === 'classId')
          throw new NotFoundException('This class not found');
      }
      if (error.code === 'P2025')
        throw new NotFoundException("This user didn't  exist");
    }
  }
}
