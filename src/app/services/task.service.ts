import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
    private readonly BASE_URL = 'https://localhost:7049/api'; 
  
    private readonly TASK = this.BASE_URL + '/task'; 
  

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.TASK);
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.TASK, task);
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(this.TASK, task);
  }

  removeTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.TASK}/${taskId}`);
  }
}
