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
    ml: false,
    lyz:false,
    PL : false,
    hrn : false,
    stip : false,
    kg:false,
    l: false,
  };
  ks:boolean;
g:boolean;
ml:boolean;
lyz: boolean;
PL:boolean;
hrn: boolean;
stip: boolean;
kg: boolean;
l: boolean;
  unit: string;
  ingrediences: any = [];
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: UserDTO, private userService: UserService, private httpClient: HttpClient, private ingredientService: IngredientService, private cdr: ChangeDetectorRef) {
  }

 
  selectedIngredients: string = '';
  vyberJednotku(unit : string){
    this.ks = false;
    this.g = false;
    this.ml = false;
    this.lyz = false;
    this.PL = false;
    
    this.hrn = false;
    this.stip = false;
    this.kg = false;
    this.l = false;
    this.unit = "";
    if (unit == "g" && this.selectedUnits.g == true) {
      this.unit = " g"; // Grams
      this.g = true;
      this.ks = false;
      this.ml = false;
      this.lyz = false;
      this.PL = false;
      
      this.hrn = false;
      this.stip = false;
      this.kg = false;
      this.l = false;


    }
    else if (unit == "ml" &&  this.selectedUnits.ml == true) {
      this.unit = " ml"; // Milliliters
      this.g = false;
      this.ks = false;
      this.ml = true;
      this.lyz = false;
      this.PL = false;
      
      this.hrn = false;
      this.stip = false;
      this.kg = false;
      this.l = false;
    }
    else if (unit == "ks" && this.selectedUnits.ks == true) {
      this.unit = " ks"; // Pieces
      this.g = false;
      this.ks = true;
      this.ml = false;
      this.lyz = false;
      this.PL = false;
      
      this.hrn = false;
      this.stip = false;
      this.kg = false;
      this.l = false;
      
    }
    else if (unit == "lyz" && this.selectedUnits.lyz == true) { // Corresponds to ČL (Teaspoon) checkbox
      this.unit = " ČL"; // Teaspoon (Čajová lyžička)
      this.g = false;
      this.ks = false;
      this.ml = false;
      this.lyz = true;
      this.PL = false;
      
      this.hrn = false;
      this.stip = false;
      this.kg = false;
      this.l = false;
    }
    else if (unit == "PL" &&  this.selectedUnits.PL == true) { // Corresponds to PL (Tablespoon) checkbox
      this.unit = " PL"; // Tablespoon (Polievková lyžica)
      this.g = false;
      this.ks = false;
      this.ml = false;
      this.lyz = false;
      this.PL = true;
      
      this.hrn = false;
      this.stip = false;
      this.kg = false;
      this.l = false;
    }
    else if (unit == "hrn" && this.selectedUnits.hrn == true) { // Corresponds to hrn (Cup) checkbox
      this.unit = " hrn"; // Cup (Hrnček)
      this.g = false;
      this.ks = false;
      this.ml = false;
      this.lyz = false;
      this.PL = false;
      
      this.hrn = true;
      this.stip = false;
      this.kg = false;
      this.l = false;
      
    }
    else if (unit == "stip" && this.selectedUnits.stip == true) { // Corresponds to štip (Pinch) checkbox
      this.unit = " štip"; // Pinch (Štipka)
      this.g = false;
      this.ks = false;
      this.ml = false;
      this.lyz = false;
      this.PL = false;
      
      this.hrn = false;
      this.stip = true;
      this.kg = false;
      this.l = false;
    }
    else if (unit == "kg" &&  this.selectedUnits.kg == true) { // Corresponds to kg (Kilogram) checkbox
      this.unit = " kg"; // Kilogram
      this.g = false;
      this.ks = false;
      this.ml = false;
      this.lyz = false;
      this.PL = false;
      
      this.hrn = false;
      this.stip = false;
      this.kg = true;
      this.l = false;

    }
     else if (unit == "l" &&      this.selectedUnits.l == true) { // Corresponds to l (Liter) checkbox
      this.unit = " l"; // Liter
      this.g = false;
      this.ks = false;
      this.ml = false;
      this.lyz = false;
      this.PL = false;
      
      this.hrn = false;
      this.stip = false;
      this.kg = false;
      this.l = true;
    }
  

  }
  isAnyUnitSelected(){
    if(this.unit != "")
      return true
    else
      return false
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
