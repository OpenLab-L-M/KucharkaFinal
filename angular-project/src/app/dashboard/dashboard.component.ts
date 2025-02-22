import { Component, inject, OnInit } from '@angular/core';
import { TestService } from '../test.service';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { MatList, MatListItem } from '@angular/material/list';
import { MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable, MatTableDataSource } from '@angular/material/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RecipesService } from 'src/services/recipes.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    MatList,
    MatListItem,
    NgForOf,
    MatTable,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatColumnDef,
    MatRowDef,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRow
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private testService = inject(TestService);
  neviem: any;
  dataSource: MatTableDataSource<string>;
   recipesServíce = inject(RecipesService);

  ngOnInit(): void {
    this.recipesServíce.getCalories("banana")
    .pipe(takeUntilDestroyed())
    .subscribe(result => {
      this.neviem = result.toString();
      console.log(result);

    });
  }
}
interface Kalorie{
      sugar_g: number;
      fiber_g: number;
      serving_size_g: number;
      sodium_mg: number;
      name: string;
      potassium_mg: number;
      fat_saturated_g: number; 
      fat_total_g: number;
      calories: number;
      cholesterol_mg: number;
      protein_g: number;
      carbohydrates_total_g: number;
  
}