import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TaskDTO } from 'src/app/task-list/TaskDTO';

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
    return this.http.post<void>(this.taskUrl + '/createTask', taskToCreate)
   }
}
