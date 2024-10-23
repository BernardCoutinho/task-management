import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskRequest } from '../../models/taskRequest.model';
import { PagedResult } from '../../models/PagedResult.model';

@Component({
  standalone: true,
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class TodoListComponent implements OnInit {
  paginatedTasks!: PagedResult<Task>;
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  isEditMode = false;
  taskBeingEdited: Task | null = null;

  modalForm!: FormGroup;

  constructor(private taskService: TaskService, private modalService: NgbModal, private route: ActivatedRoute) {}

  ngOnInit() {
    this.modalForm = new FormGroup({
      taskTitle: new FormControl('', [Validators.required]),
      taskDescription: new FormControl('', [Validators.required]),
    });
    this.loadTasks()
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

  closeModal(modal: any) {
    modal.close();
  }

  loadTasks() {
    this.taskService.getTasks(this.currentPage, this.itemsPerPage).subscribe((data: PagedResult<Task>) => {
      this.paginatedTasks = data;
      this.totalPages = Math.ceil(this.paginatedTasks.totalItems / this.itemsPerPage);
    });
  }

  addTask(modal: any) {
    if (this.modalForm.valid) {
      const newTask: TaskRequest = {
        userId: 1,
        title: this.modalForm.get('taskTitle')?.value,
        description: this.modalForm.get('taskDescription')?.value,
        completed: false
      };

      if (this.isEditMode && this.taskBeingEdited) {
        newTask.id = this.taskBeingEdited.id;
        this.taskService.updateTask(newTask).subscribe(() => {
          this.loadTasks(); 
        });
      } else {
        this.taskService.addTask(newTask).subscribe(() => {
          this.loadTasks();  
        });
      }

      this.closeModal(modal);
      this.updatePagination();
    }
  }

  removeTask(task: Task) {
    if(task.id && !task.completed){
      this.taskService.removeTask(task.id).subscribe(() => {
        this.loadTasks();  
      });
    }
  }

  completeTask(task: Task) {
    task.completed = !task.completed;
    this.taskService.updateTask(task).subscribe(() => {
      this.loadTasks(); 
    });
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.paginatedTasks?.totalItems / this.itemsPerPage); 
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTasks();  
    }
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadTasks();  
    }
  }
}
