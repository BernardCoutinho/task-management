import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
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
  imports: [ReactiveFormsModule, CommonModule]
})
export class TodoListComponent implements OnInit {
  tasks: Task[] = [];
  paginatedTasks: Task[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  isModalOpen = false;
  isEditMode = false; // Para controlar se o modal está em modo de edição
  taskBeingEdited: Task | null = null; // Para manter a referência da tarefa que está sendo editada

  // Formulário para adicionar/editar tarefas no modal
  modalForm!: FormGroup;

  ngOnInit() {
    this.modalForm = new FormGroup({
      taskTitle: new FormControl('', [Validators.required]),
      taskDescription: new FormControl('', [Validators.required]),
    });

    this.updatePagination();
  }

  // Abre o modal para adição de tarefa
  openModal() {
    this.isEditMode = false; // Não estamos editando uma tarefa
    this.modalForm.reset();
    this.isModalOpen = true;
  }

  // Fecha o modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Adiciona uma nova tarefa ou salva a edição
  addTask() {
    if (this.modalForm.valid) {
      const newTaskTitle = this.modalForm.get('taskTitle')?.value;
      const newTaskDescription = this.modalForm.get('taskDescription')?.value;

      if (this.isEditMode && this.taskBeingEdited) {
        // Se estamos no modo de edição, apenas atualizamos a tarefa
        this.taskBeingEdited.title = newTaskTitle;
        this.taskBeingEdited.description = newTaskDescription;
        this.taskBeingEdited = null;
      } else {
        // Se não estamos editando, é uma nova tarefa
        this.tasks.push({ title: newTaskTitle, description: newTaskDescription, completed: false });
      }

      this.modalForm.reset();
      this.closeModal();
      this.updatePagination();
    }
  }

  // Função de edição da tarefa
  editTask(task: Task) {
    this.isEditMode = true; // Estamos em modo de edição
    this.taskBeingEdited = task; // Definimos a tarefa que está sendo editada

    // Preenche o modal com os valores da tarefa existente
    this.modalForm.setValue({
      taskTitle: task.title,
      taskDescription: task.description
    });

    this.isModalOpen = true; // Abre o modal para edição
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

  // Completar tarefa
  completeTask(task: Task) {
    task.completed = !task.completed;
  }

  // Remover tarefa
  removeTask(task: Task) {
    this.tasks = this.tasks.filter(t => t !== task);
    this.updatePagination();
  }
}
