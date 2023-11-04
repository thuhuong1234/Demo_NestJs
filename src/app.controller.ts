import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    throw new NotFoundException();
  }

  @Get('/handle')
  getHandler() {
    throw new BadRequestException();
  }

  @Get('/error')
  async getError() {
    throw new ForbiddenException();
  }
}
