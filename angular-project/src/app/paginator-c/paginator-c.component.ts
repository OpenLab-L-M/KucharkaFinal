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
  length = input.required<number>(); // Use input() for one-way data flow down

  // Model Inputs (Two-Way Binding): Parent provides initial value,
  // child updates it, and parent gets notified implicitly.
  pageSize = model.required<number>(); // Required initial page size
  pageIndex = model(0); // Default to first page (index 0)

  // Output to Parent: Emit event when page changes
  pageChanged = output<PageEvent>(); // Use output()

  // Function to handle the paginator's (page) event
  onPageChange(event: PageEvent): void {
    // Update the model signals - this notifies the parent via the two-way binding
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);

    // Explicitly emit the event for the parent to react (e.g., fetch new data)
    this.pageChanged.emit(event);
  }
}
