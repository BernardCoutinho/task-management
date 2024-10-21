import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';

export interface Task {
  title: string;
  description: string;
  completed: boolean;
}

@Component({
  standalone: true,
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, ModalModule]
})
export class TodoListComponent implements OnInit {
  tasks: Task[] = [];
  paginatedTasks: Task[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  modalRef?: BsModalRef;
  isEditMode = false;
  taskBeingEdited: Task | null = null;

  modalForm!: FormGroup;

  constructor(private modalService: BsModalService) {}

  ngOnInit() {
    this.modalForm = new FormGroup({
      taskTitle: new FormControl('', [Validators.required]),
      taskDescription: new FormControl('', [Validators.required]),
    });

    this.updatePagination();
  }

  openModal(template: TemplateRef<any>) {
    this.isEditMode = false;
    this.modalForm.reset();
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  addTask() {
    if (this.modalForm.valid) {
      const newTaskTitle = this.modalForm.get('taskTitle')?.value;
      const newTaskDescription = this.modalForm.get('taskDescription')?.value;

      if (this.isEditMode && this.taskBeingEdited) {
        this.taskBeingEdited.title = newTaskTitle;
        this.taskBeingEdited.description = newTaskDescription;
        this.taskBeingEdited = null;
      } else {
        this.tasks.push({ title: newTaskTitle, description: newTaskDescription, completed: false });
      }

      this.modalForm.reset();
      this.closeModal();
      this.updatePagination();
    }
  }

  editTask(task: Task, template: TemplateRef<any>) {
    this.isEditMode = true;
    this.taskBeingEdited = task;

    this.modalForm.setValue({
      taskTitle: task.title,
      taskDescription: task.description
    });

    this.modalRef = this.modalService.show(template);
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.tasks.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedTasks = this.tasks.slice(start, end);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  completeTask(task: Task) {
    task.completed = !task.completed;
  }

  removeTask(task: Task) {
    this.tasks = this.tasks.filter(t => t !== task);
    this.updatePagination();
  }
}
