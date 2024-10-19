import { Component } from '@angular/core';
import { MockApiService } from '../../services/mock-api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';

@Component({
  standalone: true,
  selector: 'app-todo-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './todo-list.component.html',
  styles: [`.completed { text-decoration: line-through; }`]
})
export class TodoListComponent {
  tasks: Task[] = [];
  currentTask = { title: '', description: '', completed: false };
  isEditing = false;

  constructor(private apiService: MockApiService) {
    this.tasks = this.apiService.getTasks(); 
  }

  addTask() {
    const newTask: Task = { title: 'Nova Tarefa', description: 'Descrição da tarefa', completed: false };
    this.tasks.push(newTask);
  }

  toggleComplete(task: Task) {
    task.completed = !task.completed;
  }

  editTask(task: Task) {
    this.isEditing = true;
    this.currentTask = { ...task };
  }

  saveTask() {
    this.isEditing = false;
  }

  removeTask(task: Task) {
    this.tasks = this.tasks.filter(t => t !== task);
  }
}
