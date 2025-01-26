import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TaskService } from 'src/services/task.service';
import { TaskDTO } from '../task-list/TaskDTO';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { resourceChangeTicket } from '@angular/compiler-cli/src/ngtsc/core';


@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [DatePipe, CommonModule, ReactiveFormsModule],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css'
})
export class TaskDetailComponent {
  setTaskForm: TaskDTO;
  taskEditForm= new FormGroup({
    priority: new FormControl(null, Validators.required),
    deadLine: new FormControl(null, Validators.required),
    name: new FormControl('', Validators.required),
    description: new FormControl('')
  })
  editing: boolean = false;
  task = signal<TaskDTO>(undefined);
  route = inject(ActivatedRoute)
  router = inject(Router);
  taskService = inject(TaskService);
    private destroy$ = new Subject<void>();
  ngOnInit(){
    const id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.taskService.getTasksDetail(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(result => this.task.set(result));
    
    this.taskService.getTasksDetail(id)
       .subscribe(result => {
        this.setTaskForm = result;
        this.task.set(result);
        this.taskEditForm.patchValue({
          name: this.setTaskForm.name,
          priority: this.setTaskForm.priority,
          description: this.setTaskForm.description,
        deadLine: this.setTaskForm.deadLine,
        })
      })
    }
  editTask(){
    this.editing = true;
  }
  deleteTask(){ 
    const id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.taskService.deleteTask(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(result => {this.task.set(null)
      this.router.navigate(['taskList'])
    });
    
  }
  submit(){

    this.editing= false;
    this.taskService.editTask({
      id: parseInt(this.route.snapshot.paramMap.get('id')),
      priority: this.taskEditForm.controls['priority']?.value,
      deadLine: this.taskEditForm.controls['deadLine']?.value,
      name: this.taskEditForm.controls['name']?.value,
      description: this.taskEditForm.controls['description']?.value,

    })
    .pipe(takeUntil(this.destroy$))
    .subscribe(result => this.task.set(result))
  }
}
