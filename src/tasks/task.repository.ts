import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';

@EntityRepository()
export class TaskReporsitory extends Repository<Task> {}
