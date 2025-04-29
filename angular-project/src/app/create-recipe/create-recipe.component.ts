import { HttpClient } from '@angular/common/http';
import {Component, EventEmitter, HostListener, inject, Inject, OnInit, Output} from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule, Validators, FormsModule, FormArray} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { RecipesService } from 'src/services/recipes.service';
import { RecipesDTO } from '../DTOs/RecipesDTO';
import { signal } from '@angular/core';
import { createRecipe } from './createRecipe';
import {catchError, delay, Observable, Subject, takeUntil} from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import {MatIcon} from "@angular/material/icon";
import { MatCard } from '@angular/material/card';
import {MatTooltip} from "@angular/material/tooltip";
import {DialogOverviewExampleDialog} from "../user-profile/user-profile.component";
import { ChangeDetectorRef } from '@angular/core'; // Import ChangeDetectorRef
import {
  MAT_DIALOG_DATA,
  MatDialog, MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {CommonModule, NgFor, NgForOf, NgIf} from "@angular/common";
import {UserDTO} from "../DTOs/UserDTO";
import {UserService} from "../../services/user.service";
import {IngredienceDTO} from "../DTOs/IngredienceDTO";
import {IngredientService} from "./IngredientService";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { IngredientsFilterPipe } from './ingredients-filter.pipe';
import { DialogComponent } from './dialog/dialog.component';
import { getBaseUrl } from 'src/main';
import { AddGramsDialogComponent } from './add-grams-dialog/add-grams-dialog.component';
import { trigger } from '@angular/animations';
import * as translate from 'deepl'; // Import the deepl library (assuming it is from npm)
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { MatRadioButton } from '@angular/material/radio';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
export const environment = {
  API_KEY: "AIzaSyDsaNk1Gesqy1mFhA5Maj-w83uUClWzr-8",
};
@Component({
  selector: 'app-create-recipe',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, MatCard,
     MatSelectModule, MatInputModule, MatFormFieldModule, MatCardModule, MatButtonModule,
      MatSliderModule, FormsModule, MatIcon, MatTooltip, MatDialogClose, NgIf,CdkDrag,CdkDropList, NgFor, IngredientsFilterPipe, CommonModule, MatRadioButton, MatProgressSpinnerModule
  ],
  templateUrl:'./create-recipe.component.html',
  styleUrl: './create-recipe.component.scss'
})
export class CreateRecipeComponent {
  private cdr = Inject(ChangeDetectorRef);
  ingredience: IngredienceDTO = {Name: ''};
  inputString: string = '';
  userService = inject(UserService)
  ingredients: string[] = [];
  currentUser: UserDTO;
  //ingredients: Array<string>;//= ["múka", "vajíčka", "mlieko", "cukor", "maslo", "soľ", "orechy", "ovocie", "zelenina", "ryža", "cesnak", "cibuľa", "paprika", "kura", "hovädzina", "bravčová", "losos", "tuniak", "olivový olej", "ocet", "korenie", "cestoviny", "zemiaky", "mrkva", "brokolica", "karfiol", "špenát", "jablká", "hrušky", "banány", "pomaranče", "citróny", "jahody", "čučoriedky", "maliny", "čerešne", "broskyne", "marhule", "ananás", "kiwi", "mango", "avokádo", "paradajky", "uhorky", "zeler", "cícer", "sója", "lentičky", "fazuľa", "hrach", "jogurt", "smotana", "syr", "káva", "čaj", "kakao"];
dummy: number = 0;
  rada: string = "";
  showSuggestionsMobile = false; 
  getDataFromChild(e){
    debugger;
    this.inputString = e;
    this.ingredients.push(this.inputString);
  }
  innerWidth: any;
  @HostListener('window:resize', ['$event'])
onResize(event) {
  this.innerWidth = window.innerWidth;
  if (this.innerWidth > 699 && this.showSuggestionsMobile) {
    this.showSuggestionsMobile = false;
  }
}
toggleSuggestionsMobile(): void {
  this.showSuggestionsMobile = !this.showSuggestionsMobile;
}

  ngOnInit() {
    this.setIngredients();
    this.innerWidth = window.innerWidth;
     this.userService.getCurrentUser()
     .pipe(takeUntil(this.destroy$))
     .subscribe(result => this.currentUser = result)
  }

  setIngredients(){
    this.recipesServíce.setIngredients()
    .pipe(takeUntil(this.destroy$))
    .subscribe(result => this.ingredients = result);
  }
  vybrane = [''];


  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.dummy++;
      if(event.container.data == this.vybrane){
        const dialogRef = this.dialog.open(AddGramsDialogComponent, {
          width: '500px',
        } );
    
    
        dialogRef.afterClosed().subscribe(result => {
          console.log(result.grams)
          this.vybrane[event.currentIndex] = result.data +  " " + this.vybrane[event.currentIndex];
          if(this.profileForm.controls['name'].value != ""){
            setTimeout(() => this.TestGeminiPro())
          }
          else{
            console.log("nezadal si názov receptu, prosím zadaj ho, lebo inak ti neviem napísať vhodné ingrediencie")
          }

    
        });
      }

    }
  }

  searchTerm: string  = '';
  disabled = false;
  max = 300;
  min = 0;
  showTicks = false;
  step = 10;
  thumbLabel = false;
  value = 0;

  postupForm = new FormGroup({
    postupy: new FormArray([], Validators.required)
  });
  get postupy() {
    return this.postupForm.get('postupy') as FormArray;
    console.log(this.postupy);
  }

  pridajPostup() {
    const postup = new FormControl('');
    this.postupy.push(postup);
  }

  profileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    ingr: new FormControl(''),
    cas: new FormControl(null),
    diff: new FormControl(''),
    veganske: new FormControl(null),
    vegetarianske: new FormControl(null),
    bezlepkove: new FormControl(null),
    nizkoKaloricke: new FormControl(null),
    img: new FormControl(''),
    ranajky: new FormControl(null),
    obed: new FormControl(null),
    vecera: new FormControl(null)
  });




  private destroy$ = new Subject<void>();
  newRecipe = signal<createRecipe>(undefined);
  constructor(private httpClient: HttpClient, private recipesServíce: RecipesService, private router: Router, private dialog: MatDialog, protected ingredientService: IngredientService){}

  onSubmit() {
    // TODO: Use EventEmitter with form value
  //  this.createRecipe();
    console.warn(this.profileForm.value);


  }

  updateIngredients(event: any) {
    const ingrControl = this.profileForm.get('ingr');
    if (event.target.checked) {
      // Add the ingredient to the form control if checked
      const currentValue = ingrControl.value || '';
      const newIngredient = event.target.value;
      const updatedValue = currentValue ? currentValue + ', ' + newIngredient : newIngredient;
      ingrControl.setValue(updatedValue);
    } else {
      // Remove the ingredient from the form control if unchecked
      const currentValue = ingrControl.value || '';
      const ingredientToRemove = event.target.value;
      const updatedValue = currentValue.replace(ingredientToRemove, '').replace(/,\s*,/, ',').trim();
      ingrControl.setValue(updatedValue);
    }
  }
  
  data: any;
  dTuky:number = 0;
  dCukor:number = 0;
  dSacharidy:number = 0;
  dBielkoviny:number = 0;
  dKalorie:number = 0;
  dGramaz:number = 0;

prelozene:string = "";
translate = require("deepl");
uprava: string[] = [];
ingr = "";

private async createRecipe(value: Number) {
  await this.translateingr();
    this.recipesServíce.getCalories(this.prelozene)
    .subscribe(result => {
        this.data = result;

        let vypocet = 0;
        this.dKalorie= 0;
        this.dTuky= 0;
        this.dCukor= 0;
        this.dSacharidy= 0;
        this.dBielkoviny= 0;
        this.dGramaz= 0;

        if (this.data && Array.isArray(this.data.foods)) { // Check if this.data and foods are defined

          for (let i = 0; i < this.data.foods.length; i++) {
                const food = this.data.foods[i];
                if (food && typeof food.nf_calories === 'number') {  // Check if food and nf_calories are defined and a number
                    this.dKalorie += food.nf_calories;
                    this.dTuky += food.nf_total_fat;
                    this.dCukor += food.nf_sugars;
                    this.dSacharidy += food.nf_total_carbohydrate;
                    this.dBielkoviny += food.nf_protein;
                    this.dGramaz += food.serving_weight_grams;
            }
            else{
              console.log("error");
            }
        }

        this.recipesServíce.CreateRecipe({
          name: this.profileForm.controls['name'].value,
          description: this.profileForm.controls['description'].value,
          difficulty: this.profileForm.controls['diff'].value,
          imageURL: this.profileForm.controls['img'].value,
          ingrediencie: this.vybrane.join(', '),
          cas: this.profileForm.controls['cas'].value,
          veganske: this.profileForm.controls['veganske']?.value,
          vegetarianske: this.profileForm.controls['vegetarianske']?.value,
          bezlepkove: this.profileForm.controls['bezlepkove']?.value,
          postupicky: (this.postupForm.get('postupy') as FormArray).value,
          tuky: Math.ceil(this.dTuky),
          cukor: Math.ceil(this.dCukor),
          sacharidy: Math.ceil(this.dSacharidy),
          bielkoviny: Math.ceil(this.dBielkoviny),
          kalorie: Math.ceil(this.dKalorie),
          gramaz: Math.ceil(this.dGramaz),
          imageId: value,
          ranajky: this.profileForm.controls['ranajky']?.value,
          obed: this.profileForm.controls['obed']?.value,
          vecera: this.profileForm.controls['vecera']?.value,
        }).pipe(takeUntil(this.destroy$))

        .subscribe(() => this.router.navigate(['/Recipes']));
        this.ingredientService.selectedIngredients = "";
    }})
  // this.translate({
  //   free_api: true,
  //   text: this.vybrane.join(", ").toString(),
  //   target_lang: 'EN',
  //   auth_key: '68a1f6a1-cd34-47dd-bbda-2c958feb60aa:fx',
  // }).then(result => {

  //     this.prelozene = result.data.translations[0].text;
  //     this.recipesServíce.getCalories(this.prelozene)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(result => {
  //         this.data = result;

  //         let vypocet = 0;
  //         this.dKalorie= 0;
  //         this.dTuky= 0;
  //         this.dCukor= 0;
  //         this.dSacharidy= 0;
  //         this.dBielkoviny= 0;
  //         this.dGramaz= 0;

  //         if (this.data && Array.isArray(this.data.foods)) { // Check if this.data and foods are defined

  //           for (let i = 0; i < this.data.foods.length; i++) {
  //                 const food = this.data.foods[i];
  //                 if (food && typeof food.nf_calories === 'number') {  // Check if food and nf_calories are defined and a number
  //                     this.dKalorie += food.nf_calories;
  //                     this.dTuky += food.nf_total_fat;
  //                     this.dCukor += food.nf_sugars;
  //                     this.dSacharidy += food.nf_total_carbohydrate;
  //                     this.dBielkoviny += food.nf_protein;
  //                     this.dGramaz += food.serving_weight_grams;
  //             }
  //             else{
  //               console.log("error");
  //             }
  //         }

  //         this.recipesServíce.CreateRecipe({
  //           name: this.profileForm.controls['name'].value,
  //           description: this.profileForm.controls['description'].value,
  //           difficulty: this.profileForm.controls['diff'].value,
  //           imageURL: this.profileForm.controls['img'].value,
  //           ingrediencie: this.vybrane.join(', '),
  //           cas: this.profileForm.controls['cas'].value,
  //           veganske: this.profileForm.controls['veganske']?.value,
  //           vegetarianske: this.profileForm.controls['vegetarianske']?.value,
  //           postupicky: (this.postupForm.get('postupy') as FormArray).value,
  //           tuky: Math.ceil(this.dTuky),
  //           cukor: Math.ceil(this.dCukor),
  //           sacharidy: Math.ceil(this.dSacharidy),
  //           bielkoviny: Math.ceil(this.dBielkoviny),
  //           kalorie: Math.ceil(this.dKalorie),
  //           gramaz: Math.ceil(this.dGramaz),
  //           imageId: value,
  //           ranajky: this.profileForm.controls['ranajky']?.value,
  //           obed: this.profileForm.controls['obed']?.value,
  //           vecera: this.profileForm.controls['vecera']?.value,
  //         }).pipe(takeUntil(this.destroy$))

  //         .subscribe(() => this.router.navigate(['/Recipes']));
  //         this.ingredientService.selectedIngredients = "";
  //     }});
  // })
  // .catch(error => {
  //     console.error(error);
  // });

}
onSliderChange(event: any) {
  const sliderValue = event.target.value; // Get the slider value
  this.profileForm.controls['cas'].setValue(sliderValue); // Update the form control
}

 genAI = new GoogleGenerativeAI(environment.API_KEY);
  generationConfig = {
   safetySettings: [
     {
       category: HarmCategory.HARM_CATEGORY_HARASSMENT,
       threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
     },
   ],
   temperature: 0.9,
   top_p: 1,
   top_k: 32,
   maxOutputTokens: 100, // limit output
 };
  model = this.genAI.getGenerativeModel({
   model: 'gemini-2.0-flash', // or 'gemini-pro-vision'
   ...this.generationConfig,
 });
suggestions: string[] = [];
 async TestGeminiPro() {
  const prompt = 'Prikladám ti názov receptu, ' +  this.profileForm.controls['name'].value + '+ moje ingrediencie ' + this.vybrane + 'prosím pridaj nejaké ďalšie ingrediencie ktoré by mohli byť zdravé a chutné do tohto receptu';
  
  const result = await this.model.generateContent(prompt);
  const response = await result.response;
  this.suggestions = response.text().split("\n").filter(v => v!='');
  console.log(this.suggestions);
}
async translateingr() {
  const prompt = 'prelož do angličtiny priložené ingrediencie, ' +  this.vybrane + 'vráť iba to čo si preložil, ako 1 string oddelený čiarkami';
  
  const result = await this.model.generateContent(prompt);
  const response = await result.response;
  this.prelozene = response.text();
  console.log(this.suggestions);
}


  openDialogis(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
    });


    dialogRef.afterClosed().subscribe(result => {
      this.ingredients.push(result.data);

    });

  }

  deleteIngredient(ingr: string){
    this.recipesServíce.deleteIngredient(ingr)
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => this.ingredients = this.ingredients.filter(x => x != ingr));
  }

  uploadedImage: File;
  dbImage: any;
  postResponse: any;
  successResponse: string;
  image: any;

  public onImageUpload(event) {
    this.uploadedImage = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.liveDemo = e.target.result;
    }
    reader.readAsDataURL(event.target.files[0]);
  }

  liveDemo:any;


  BASE_URL= getBaseUrl();
  imageUploadAction() {
    const imageFormData = new FormData();
    imageFormData.append('image', this.uploadedImage, this.uploadedImage.name);


    this.httpClient.post(this.BASE_URL + '/recipes/upload', imageFormData)
      .subscribe((value: number) => {
        this.createRecipe(value);
        }
      );
  }




  // uploadedImage: File;
  // dbImage: any;
  // postResponse: any;
  // successResponse: string;
  // image: any;

  // public onImageUpload(event) {
  //   this.uploadedImage = event.target.files[0];
  // }


  // imageUploadAction() {
  //   const imageFormData = new FormData();
  //   imageFormData.append('image', this.uploadedImage, this.uploadedImage.name);


  //   this.httpClient.post('http://localhost:4200/CreateRecipe', imageFormData, { observe: 'response' })
  //     .subscribe((response) => {
  //      if (response.status === 200) {
  //         this.postResponse = response;
  //         this.successResponse = this.postResponse.body.message;
  //       } else {
  //         this.successResponse = 'Image not uploaded due to some error!';
  //       }
  //     }
  //     );
  //   }

  // viewImage() {
  //   this.httpClient.get('http://localhost:4200/CreateRecipe' + this.image)
  //     .subscribe(
  //       res => {
  //         this.postResponse = res;
  //         this.dbImage = 'data:image/jpeg;base64,' + this.postResponse.image;
  //       }
  //     );
  // }
}








