import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/common/config/storage.config';
import { Roles } from '../../common/decorators/role.decorator';
import { Role } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.admin)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.admin)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.admin)
  @UseInterceptors(FileInterceptor('avatar', { storage }))
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    updateUserDto.avatar = file.path.replace(/\\/g, '/');
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.admin)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
