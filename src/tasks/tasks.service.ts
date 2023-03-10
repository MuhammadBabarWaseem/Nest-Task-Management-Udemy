import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Logger } from '@nestjs/common/services';
import { TaskStatus } from './tasks.status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Injectable()
export class TasksService {
  private logger = new Logger('Task Service', { timestamp: true });
  constructor(
    @InjectRepository(Task)
    private task: Repository<Task>,
  ) {}

  async getAllTask(
    filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.task.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)) ',
        { search: `%${search}%` },
      );
    }
    try {
      const task = await query.getMany();
      return task;
    } catch (error) {
      this.logger.error(
        `Failed To Get Task For User "${user.username}".`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  // :Promist<Task></Task> this define return type must be a Task promise
  async getTaskById(id: string, user: User) {
    const found = await this.task.findOne({ where: { id, user } });
    if (!found) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User) {
    const { title, description } = createTaskDto;

    const task = this.task.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.task.save(task);
    return task;
  }

  async delete(id: string, user: User) {
    const result = await this.task.delete({ id, user });

    if (result.affected === 0) {
      return {
        message: `User with ID ${id} not found`,
      };
    }
    return `Task With Id: ${id} Deleted Successfully!`;
  }

  async UpdateTask(status: TaskStatus, id: string, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.task.save(task);
    return task;
  }
}
