import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-card-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-task-item.component.html',
  styleUrl: './card-task-item.component.scss'
})
export class CardTaskItemComponent {
  @Input() task!: Task;
  @Output() completeTask = new EventEmitter<Task>();
  @Output() editTask = new EventEmitter<Task>();
  @Output() removeTask = new EventEmitter<Task>();

  onCompleteTask() {
    this.completeTask.emit(this.task);
  }

  onEditTask() {
    this.editTask.emit(this.task);
  }

  onRemoveTask() {
    this.removeTask.emit(this.task);
  }
}
