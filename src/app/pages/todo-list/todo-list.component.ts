import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskRequest } from '../../models/taskRequest.model';
import { PagedResult } from '../../models/PagedResult.model';
import { CardTaskItemComponent } from '../../components/card-task-item/card-task-item.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  standalone: true,
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, CardTaskItemComponent]
})
export class TodoListComponent implements OnInit {
  paginatedTasks!: PagedResult<Task>;
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  isEditMode = false;

  modalForm!: FormGroup;

  constructor(private toastrService: ToastrService, private taskService: TaskService, private modalService: NgbModal, private route: ActivatedRoute) {}

  ngOnInit() {
    this.modalForm = new FormGroup({
      id: new FormControl(null),
      taskTitle: new FormControl('', [Validators.required]),
      taskDescription: new FormControl('', [Validators.required]),
      userId: new FormControl(null)
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
      this.modalForm.setValue({
        id: task.id,
        taskTitle: task.title,
        taskDescription: task.description,
        userId: task.userId
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
        id: this.modalForm.get('id')?.value,
        title: this.modalForm.get('taskTitle')?.value,
        description: this.modalForm.get('taskDescription')?.value,
        completed: false,
        userId: this.modalForm.get('userId')?.value,
      };
  
      
      if (newTask.id) {
        
        this.taskService.updateTask(newTask).subscribe({
          next: () => {
            this.loadTasks(); 
            this.toastrService.success("Task atualizada com sucesso!", "Sucesso");
          },
          error: (err) => {
           
            this.toastrService.error(err.message || "Erro ao atualizar task", "Erro");
          }
        });
      } else {
        
        this.taskService.addTask(newTask).subscribe({
          next: () => {
            this.loadTasks(); 
            this.toastrService.success("Task adicionada com sucesso!", "Sucesso");
          },
          error: (err) => {
            
            this.toastrService.error(err.message || "Erro ao adicionar task", "Erro");
          }
        });
      }
  
     
      this.closeModal(modal);
      this.updatePagination(); 
    } else {
      
      this.toastrService.warning("Preencha os campos obrigatórios", "Aviso");
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
