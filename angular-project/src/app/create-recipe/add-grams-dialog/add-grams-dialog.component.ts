import { ChangeDetectorRef, Component, inject, Inject, OnInit } from '@angular/core';
import { IngredienceDTO } from '../../DTOs/IngredienceDTO';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from 'src/app/user-profile/user-profile.component';
import { UserDTO } from 'src/app/DTOs/UserDTO';
import { UserService } from 'src/services/user.service';
import { HttpClient } from '@angular/common/http';
import { IngredientService } from '../IngredientService';
import { CommonModule, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { getBaseUrl } from 'src/main';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatRadioButton } from '@angular/material/radio';

@Component({
  selector: 'app-add-grams-dialog',
  standalone: true,
  imports: [ FormsModule,
    MatDialogTitle,
    MatDialogContent,
    NgForOf,
    MatButtonModule,
    MatLabel,
    MatIcon,
    MatFormField,
    MatHint,
  MatCheckbox,
MatRadioButton],
  templateUrl: './add-grams-dialog.component.html',
  styleUrl: './add-grams-dialog.component.css'
})
export class AddGramsDialogComponent {
  BASE_URL= getBaseUrl();
  ingredience: IngredienceDTO;
  inputString: string = '';
  selectedUnits = {
    ks: false,
    g: false,
    ml: false
  };
  ks:boolean;
g:boolean;
ml:boolean;
  unit: string;
  ingrediences: any = [];
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: UserDTO, private userService: UserService, private httpClient: HttpClient, private ingredientService: IngredientService, private cdr: ChangeDetectorRef) {
  }

 
  selectedIngredients: string = '';
  vyberJednotku(unit : string){
    if(unit == "g"){
      this.unit = " g"
      this.g = true;
    }
    else if(unit == "ml"){
      this.unit = " ml";
      this.ml= true;
    }
    else if (unit == "ks"){
      this.unit = " ks";
      this.ks = true;
    }
  }
  addGrams(){
    this.ingredience = new IngredienceDTO();
    this.ingredience.grams = this.inputString + this.unit;
    this.ingrediences.push({ grams: this.ingredience.grams });
    this.dialogRef.close({ data: this.ingredience.grams })

    console.log(this.ingredience.grams)
    this.inputString = '';
    this.cdr.detectChanges();
  }
  /*sendIngredience() {
    this.ingredience.Name = this.inputString;
    this.httpClient.post(this.BASE_URL + '/addIngredience', this.ingredience).subscribe(response => {
        console.log(response);
        // Add the new ingredient to the list without refreshing
        this.dialogRef.close({ data: this.inputString })
        this.ingrediences.push({ name: this.ingredience.Name });
        //this.newItemEvent.emit(this.inputString);
        // Clear the input field
        this.inputString = '';
        // Trigger change detection
        this.cdr.detectChanges();
      }, error => {
        console.error('Error adding ingredient:', error);
      }
    );
  }*/

  onNoClick(): void {
    this.dialogRef.close();
  }

  addIngredience($event: any) {
    this.ingrediences.add($event);

  }


}
