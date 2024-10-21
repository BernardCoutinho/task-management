import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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
  imports: [ReactiveFormsModule, CommonModule]
})
export class TodoListComponent implements OnInit {
  tasks: Task[] = [];
  paginatedTasks: Task[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  isEditMode = false;
  taskBeingEdited: Task | null = null;

  modalForm!: FormGroup;

  constructor(private modalService: NgbModal, private route: ActivatedRoute) {}

  ngOnInit() {
    this.modalForm = new FormGroup({
      taskTitle: new FormControl('', [Validators.required]),
      taskDescription: new FormControl('', [Validators.required]),
    });

    this.updatePagination();
  }

  instanceTask(content: TemplateRef<any>, isEditMode = false, task: Task | null = null) {
    if(task?.completed){
      return
    }
    
    this.isEditMode = isEditMode;

    if (task) {
      this.taskBeingEdited = task;
      this.modalForm.setValue({
        taskTitle: task.title,
        taskDescription: task.description
      });
    } else {
      this.modalForm.reset();
    }
    this.openModal(content);
  }
  
  openModal(content: TemplateRef<any>){
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  // Fecha o modal (chamado internamente pelo NgbModal)
  closeModal(modal: any) {
    modal.close();
  }

  // Adiciona uma nova tarefa ou salva a edição
  addTask(modal: any) {
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
      this.closeModal(modal);
      this.updatePagination();
    }
  }

  // Paginação
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
    if(task?.completed){
      return
    }
    
    this.tasks = this.tasks.filter(t => t !== task);
    this.updatePagination();
  }
}
