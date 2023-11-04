import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Role } from '@prisma/client';
import { Roles } from '../../common/decorators/role.decorator';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @Roles(Role.admin)
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get()
  findAll() {
    return this.classesService.findAll();
  }

  @Get(':id')
  @Roles(Role.admin)
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.admin)
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(+id, updateClassDto);
  }

  @Delete(':id')
  @Roles(Role.admin)
  remove(@Param('id') id: string) {
    return this.classesService.remove(+id);
  }
  @Post('/add/:classId/:userId')
  @Roles(Role.admin)
  addUserToClass(
    @Param('classId') classId: string,
    @Param('userId') userId: string,
  ) {
    return this.classesService.addUserToClass(+classId, +userId);
  }

  @Delete('/delete/:classId/:userId')
  @Roles(Role.admin)
  removeUserFromClass(
    @Param('classId') classId: string,
    @Param('userId') userId: string,
  ) {
    return this.classesService.removeUserFromClass(+classId, +userId);
  }
}
