import { TaskReporsitory } from './task.repository';
import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TaskReporsitory])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
