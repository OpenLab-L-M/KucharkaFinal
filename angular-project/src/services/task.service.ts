import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TaskDTO } from 'src/app/DTOs/TaskDTO';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private route: ActivatedRoute) { }
   taskUrl = this.baseUrl + '/taskList';

   getTasks(){
      return this.http.get<TaskDTO[]>(this.taskUrl);
   }
   addTask(taskToCreate: TaskDTO){
    return this.http.post<void>(this.baseUrl + '/createTask', taskToCreate)
   }
   getTasksDetail(id: number){
    return this.http.get<TaskDTO>(this.baseUrl + '/TaskDetail/' + id)
   }
   editTask(editedTask: TaskDTO){
    return this.http.post<TaskDTO>(this.baseUrl + '/TaskDetail/edit', editedTask)
   }
   deleteTask(id: number){
    return this.http.delete<void>(this.baseUrl + '/TaskDetail/delete/' + id)
   }
   getFinishedTasks(){
    return this.http.get<TaskDTO[]>(this.baseUrl + "/finishedTasks");
   }
   changeToFinishedOrUnfinished(id: number){
    return this.http.put<TaskDTO>(this.baseUrl + "/changeToFinished", id);
   }
}
