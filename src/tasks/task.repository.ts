import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';

@EntityRepository()
export class TaskReporsitory extends Repository<Task> {}
