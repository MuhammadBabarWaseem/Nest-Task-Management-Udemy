import { Task } from './tasks.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  //   : this is for type, and the above line if tasks must be of this type Task[]

  getAllTasks(): Task[] {
    return this.tasks;
  }
}
