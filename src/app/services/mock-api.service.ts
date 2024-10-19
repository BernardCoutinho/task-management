import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class MockApiService {
  tasks = [
    { title: 'Tarefa 1', description: 'Descrição 1', completed: false },
    { title: 'Tarefa 2', description: 'Descrição 2', completed: false },
  ];

  getTasks() {
    return this.tasks;
  }

  addTask(task: Task) {
    this.tasks.push(task);
  }

  updateTask(task: Task) {
    const index = this.tasks.findIndex(t => t.title === task.title);
    if (index !== -1) {
      this.tasks[index] = task;
    }
  }

  removeTask(task: Task) {
    this.tasks = this.tasks.filter(t => t !== task);
  }
}