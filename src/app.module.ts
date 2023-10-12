import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ClassesModule } from './classes/classes.module';

@Module({
  imports: [UsersModule, ClassesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
