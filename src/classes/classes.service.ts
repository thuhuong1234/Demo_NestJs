import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { PrismaService } from 'prisma.service';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateClassDto) {
    const result = await this.prisma.class.findUnique({
      where: {
        nameClass: data.nameClass,
      },
    });
    if (result) {
      throw new NotFoundException();
    }

    return this.prisma.class.create({ data });
  }

  async findAll() {
    const classes = await this.prisma.class.findMany();
    return classes;
  }

  async findOne(id: number) {
    const result = await this.prisma.class.findUnique({
      where: {
        id: id,
      },
      include: {
        users: true,
      },
    });

    return result;
  }

  async update(id: number, updateClassDto: UpdateClassDto) {
    const result = await this.prisma.class.findUnique({
      where: {
        id: id,
      },
    });
    if (!result) {
      throw new NotFoundException();
    }
    const updateClass = await this.prisma.class.update({
      where: { id: id },
      data: updateClassDto,
    });
    return updateClass;
  }

  async remove(id: number) {
    const result = await this.prisma.class.findUnique({
      where: {
        id: id,
      },
    });
    if (!result) {
      throw new NotFoundException();
    }

    return this.prisma.class.delete({
      where: {
        id: id,
      },
    });
  }
}
