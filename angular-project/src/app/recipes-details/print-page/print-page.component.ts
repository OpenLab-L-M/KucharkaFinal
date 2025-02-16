import { Component, OnInit, inject, signal } from '@angular/core';
import { RecipesService } from 'src/services/recipes.service';
import { RecipesDTO } from 'src/app/recipes/RecipesDTO';
import { Subject, takeUntil } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconAnchor } from '@angular/material/button';

import {MatCardModule} from '@angular/material/card';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import { CommonModule, DatePipe } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInput, MatInputModule } from '@angular/material/input';


import {CreatorDTO} from 'src/app/recipes/CreatorDTO';
import { DataSource } from '@angular/cdk/collections';
import { MatPseudoCheckbox } from '@angular/material/core';

@Component({
  selector: 'app-print-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatIconAnchor, MatButtonModule, 
    MatRadioModule, MatCardModule, ReactiveFormsModule, MatFormField, MatFormFieldModule, MatLabel, MatInput, MatInputModule, DatePipe, MatPseudoCheckbox],
  templateUrl: './print-page.component.html',
  styleUrl: './print-page.component.css'
})
export class PrintPageComponent {
  route = inject(ActivatedRoute)
  recipeService = inject(RecipesService);
  image: any[] = [];
  public recipe = signal<RecipesDTO>(undefined);

  ngOnInit(): void {
  
  
      const id = parseInt(this.route.snapshot.paramMap.get('id'));
      this.recipeService.getClickedRecipes(id)
         .subscribe(result => {
          this.recipeService.chRecipe = result;
          this.recipe.set(result);
         })
         this.getImage();
        }
        ngAfterViewInit(){ 
          this.printInvoice();
        }
        
        
        showImage() {
          return `data:image/jpeg;base64,${this.image}`
        }
        getImage(){
          const id = parseInt(this.route.snapshot.paramMap.get('id'));
          this.recipeService.getImage(id).subscribe(value =>
            this.image = value.image
          )
        }
        printInvoice() {
          var divToPrint = document.getElementById('myPrintThing');
          var newWin = window.open('', 'Print-Window', 'width=1200,height=700');
          newWin.document.open();
          newWin.document.write('<html><head><link href="app/assets/css/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/><link href="app/assets/css/print.css" rel="stylesheet" type="text/css"/><style></style> </head><body onload="window.print()">' + divToPrint.innerHTML + '</body></html>');
          newWin.document.title = this.recipe().name;
          newWin.document.close();
          }



}

