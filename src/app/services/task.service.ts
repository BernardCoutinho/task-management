import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { PagedResult } from '../models/PagedResult.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
    private readonly BASE_URL = 'https://localhost:7049/api'; 
  
    private readonly TASK = this.BASE_URL + '/task'; 
  

  constructor(private http: HttpClient) {}

  getTasks(pageNumber: number, pageSize: number): Observable<PagedResult<Task>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<Task>>(this.TASK, { params });
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
