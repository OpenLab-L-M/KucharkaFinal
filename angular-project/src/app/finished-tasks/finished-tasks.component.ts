import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, Component, ViewChild, inject, signal} from '@angular/core';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { TaskDTO } from '../task-list/TaskDTO';
import { TaskService } from 'src/services/task.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-finished-tasks',
  standalone: true,
  imports: [CommonModule, DatePipe, MatSortModule, MatTableModule],
  templateUrl: './finished-tasks.component.html',
  styleUrl: './finished-tasks.component.css'
})
export class FinishedTasksComponent {
  constructor(){}
  router = inject(Router)
  dataSource = new MatTableDataSource<TaskDTO>();
  getFinishedTasks(){
    return this.taskService.getFinishedTasks()
    .pipe(takeUntil(this.destroy$))
    .subscribe(result => {this.tasks = result;
      this.dataSource.data = result;
    });
   }
  tasks: TaskDTO[];
  
  

    private destroy$ = new Subject<void>();
  taskService = inject(TaskService);
 ngOnInit(){
this.getFinishedTasks();

 }
 changeToFinishedOrUnfinished(id: number){
  this.taskService.changeToFinishedOrUnfinished(id)
  .pipe(takeUntil(this.destroy$))
  .subscribe(result => {
    console.log('result.id:', result.id);
    console.log('dataSource.data:', this.dataSource.data);
    console.log(id);

    // Ensure both values are numbers before comparison
    const deleteAt = this.dataSource.data.findIndex(task => Number(task.id) === Number(result.id));

    if (deleteAt === -1) {
      console.warn(`Task with id ${result.id} not found in dataSource.`);
      return; 
    }

    this.dataSource.data.splice(deleteAt, 1);
    this.dataSource.data = [...this.dataSource.data]; 

    console.log(deleteAt);
  });
 }
navigateToTaskDetail(id: number){
  this.router.navigate(['TaskDetail', id])
}
  private _liveAnnouncer = inject(LiveAnnouncer);

  displayedColumns: string[] = ['priority', 'name', 'startTime', 'deadLine', 'button'];


  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  
}
