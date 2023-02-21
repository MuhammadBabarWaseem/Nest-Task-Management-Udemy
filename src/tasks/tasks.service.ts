import { TaskStatus } from './tasks.status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private task: Repository<Task>,
  ) {}

  // :Promist<Task> this define return type must be a Task promise
  async getTaskById(id: string): Promise<Task> {
    const found = await this.task.findOneBy({ id });
    if (!found) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.task.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.task.save(task);
    return task;
  }
}
