import { Component, inject } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { TaskDTO } from '../task-list/TaskDTO';
import { TaskService } from 'src/services/task.service';
import { min, Subject, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink ],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent {
taskService = inject(TaskService);
router = inject(Router);
taskCreateForm= new FormGroup({
  priority: new FormControl(null, Validators.required),
  deadLine: new FormControl(null, Validators.required),
  name: new FormControl('', Validators.required),
  description: new FormControl('')
})
 private destroy$ = new Subject<void>();
  public currentDate = Date.now.toString();
submit(){
  console.log(this.taskCreateForm.controls['priority']?.value);
  console.log(this.taskCreateForm.controls['deadLine']?.value);
  console.log(this.taskCreateForm.controls['name']?.value);
  console.log(this.taskCreateForm.controls['description']?.value);
  
  this.taskService.addTask({
    priority: this.taskCreateForm.controls['priority']?.value,
    deadLine: this.taskCreateForm.controls['deadLine']?.value,//.convertToEuropeTime,
    name: this.taskCreateForm.controls['name']?.value,
    description: this.taskCreateForm.controls['description']?.value
  })
  .pipe(takeUntil(this.destroy$))
  .subscribe(() => this.router.navigate(['/taskList']));
}


}
