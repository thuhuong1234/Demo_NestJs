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
import { HttpExceptionFilter } from '../filters/http-exception.filter';

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
    try {
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
      return result;
    } catch (error) {
      console.log(error);
      if (error.code === 'P2025') {
        throw new NotFoundException('Class not found');
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updateClassDto: UpdateClassDto) {
    try {
      const updateClass = await this.prisma.class.update({
        where: { id },
        data: updateClassDto,
      });
      return updateClass;
    } catch (error) {
      throw new HttpExceptionFilter();
      console.log(error);
      if (error.code === 'P2025') {
        throw new NotFoundException('Class not found');
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      return this.prisma.class.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Class not found');
      }
      throw new InternalServerErrorException();
    }
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

      // throw new InternalServerErrorException();

      //throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

      // throw new BadRequestException('Something bad happened', {
      //   cause: new Error(),
      //   description: 'Some error description',
      // });

      // throw new HttpException(
      //   {
      //     status: HttpStatus.FORBIDDEN,
      //     error: 'This is a custom message',
      //   },
      //   HttpStatus.FORBIDDEN,
      //   {
      //     cause: error,
      //     description: 'Some error description',
      //   },
      // );
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
