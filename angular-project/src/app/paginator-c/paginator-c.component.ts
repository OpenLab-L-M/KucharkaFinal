import { Component, input, model, NgModule, output } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { RecipesComponent } from '../recipes/recipes.component';

@Component({
  selector: 'app-paginator-c',
  standalone: true,
  imports: [MatPaginatorModule, FormsModule, RecipesComponent],
  templateUrl: './paginator-c.component.html',
  styleUrl: './paginator-c.component.css'
})
export class PaginatorCComponent {
  length = input.required<number>(); 


  pageSize = model.required<number>(); 
  pageIndex = model(0); 

  pageChanged = output<PageEvent>(); 


  onPageChange(event: PageEvent): void {

    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);

    this.pageChanged.emit(event);
  }
}
