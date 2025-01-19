import { Component, inject } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { TaskDTO } from '../task-list/TaskDTO';
import { TaskService } from 'src/services/task.service';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent {
taskService = inject(TaskService);

taskCreateForm= new FormGroup({
  priority: new FormControl(null, Validators.required),
  startTime: new FormControl(null, Validators.required),
  deadLine: new FormControl(null, Validators.required),
  name: new FormControl('', Validators.required),
  description: new FormControl('')
})
submit(){
  this.taskService.addTask({
    priority: this.taskCreateForm.controls['priority'].value,
    startTime: this.taskCreateForm.controls['startTime'].value,
    deadLine: this.taskCreateForm.controls['deadLine'].value,
    name: this.taskCreateForm.controls['name'].value,
    description: this.taskCreateForm.controls['description'].value
  })
}

}
