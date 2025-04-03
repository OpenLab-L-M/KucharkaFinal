import { Component, OnInit, inject, signal } from '@angular/core';
import { RecipesService } from 'src/services/recipes.service';
import { RecipesDTO } from '../DTOs/RecipesDTO';
import { Subject, takeUntil } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIcon } from '@angular/material/icon';
import { MatIconAnchor } from '@angular/material/button';


import {MatCardModule} from '@angular/material/card';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import { CommonModule, DatePipe } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInput, MatInputModule } from '@angular/material/input';
import { RecensionsDTO } from '../DTOs/recensions-dto';

import {CreatorDTO} from 'src/app/DTOs/CreatorDTO';
import { DataSource } from '@angular/cdk/collections';
import { MatPseudoCheckbox } from '@angular/material/core';
import * as translate from 'deepl'; 
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { environment } from '../create-recipe/create-recipe.component';
@Component({
  selector: 'app-recipes-details',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatIconAnchor, MatButtonModule, MatIcon,
    MatRadioModule, MatCardModule, ReactiveFormsModule, MatFormField, MatFormFieldModule, MatLabel, MatInput, MatInputModule, DatePipe, MatPseudoCheckbox],
  providers: [DatePipe],
  templateUrl: './recipes-details.component.html',
  styleUrl: './recipes-details.component.scss'
})
export class RecipesDetailsComponent implements OnInit{
  data:any;
  

  userImages: CreatorDTO[] = [];
 public recensions = signal<RecensionsDTO[]>([])
  clicked = false;
  recipeService = inject(RecipesService);
  matches: Array<number>;
  private destroy$ = new Subject<void>();
  public recipe = signal<RecipesDTO>(undefined);
  //recipe: RecipesDTO;
  image: any[] = [];
  profileForm = new FormGroup({
    name: new FormControl(''),
    ingrediencie: new FormControl(''),
    description: new FormControl(''),
    imgURL: new FormControl(''),
    cas: new FormControl(null),
    postupicky: new FormArray([]),
  });
  
  constructor(private route: ActivatedRoute, private router: Router, private datePipe: DatePipe) { }
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
  async translateingr() {
    const prompt = 'prelož do angličtiny priložené ingrediencie, ' +  this.recipeService.chRecipe.ingrediencie + this.profileForm.controls['ingrediencie'].value+ 'vráť iba to čo si preložil, ako 1 string oddelený čiarkami';
    
    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    this.prelozene = response.text();
  }
  

  prelozene: string;
  



  dTuky:number = 0;
  dCukor:number = 0;
  dSacharidy:number = 0;
  dBielkoviny:number = 0;
  dKalorie:number = 0;
  dGramaz:number = 0;


  ngOnInit(): void {
    
    
    const id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.recipeService.getClickedRecipes(id)
       .subscribe(result => {
        this.recipeService.chRecipe = result;
        this.recipe.set(result);
        //this.getCalories();
        this.profileForm.patchValue({
          name: this.recipeService.chRecipe.name,
          ingrediencie: this.recipeService.chRecipe.ingrediencie,
          description: this.recipeService.chRecipe.description,
        imgURL: this.recipeService.chRecipe.imageURL,
        cas: this.recipeService.chRecipe.cas,
        }
        )
      },



       );
       this.recipeService.getRecension(id).pipe(takeUntil(this.destroy$))
    .subscribe(value => {this.recensions.set(value);}
    );

    this.recipeService.getImage(id).subscribe(value =>
      this.image = value.image
    )
    

    //console.log(this.currentDate);
   }
   celkoveKalorie = signal<number>(undefined);
   /*getCalories(){
    this.recipeService.getCalories(this.recipe().ingrediencie.replace(/,/g, ' '))
    .pipe(takeUntil(this.destroy$))
    .subscribe(result => {
        this.data = result;

        let vypocet = 0;

        if (this.data && Array.isArray(this.data.foods)) { // Check if this.data and foods are defined
            for (let i = 0; i < this.data.foods.length; i++) {
                const food = this.data.foods[i];
                if (food && typeof food.nf_calories === 'number') {  // Check if food and nf_calories are defined and a number
                    vypocet += food.nf_calories;
                } else {
                    console.warn(`Invalid food data or nf_calories at index ${i}`, food); // Debugging
                }
            }
        } else {
            console.warn('Invalid result format from getCalories API:', result); // Debugging
        }

        this.celkoveKalorie.set(vypocet);
        console.log("Calories " + vypocet);
        console.log(this.recipe().ingrediencie.replace(/,/g, ' '));
    });
  }*/


 
   showImage() {
     return `data:image/jpeg;base64,${this.image}`
   }


    deleteBtn() {
    const id = parseInt(this.route.snapshot.paramMap.get('id'));
      this.recipeService.deleteGuild(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.router.navigate(['/Recipes']));

  }
  edit(){
    
  this.clicked = true;

}

async submit (){
  const id = parseInt(this.route.snapshot.paramMap.get('id'));
  const ingrediencieValue = this.profileForm.controls['ingrediencie']?.value;  // Get the initial value
    await this.translateingr();
      this.recipeService.getCalories(this.prelozene)  // Use translated ingredients for getCalories
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          result => {
            this.data = result;
  
            this.dKalorie = 0;  
            this.dTuky = 0;
            this.dCukor = 0;
            this.dSacharidy = 0;
            this.dBielkoviny = 0;
            this.dGramaz = 0;
  
            if (this.data && Array.isArray(this.data.foods)) {
              for (let i = 0; i < this.data.foods.length; i++) {
                const food = this.data.foods[i];
                if (food && typeof food.nf_calories === 'number') {
                  this.dKalorie += food.nf_calories;
                  this.dTuky += food.nf_total_fat;
                  this.dCukor += food.nf_sugars;
                  this.dSacharidy += food.nf_total_carbohydrate;
                  this.dBielkoviny += food.nf_protein;
                  this.dGramaz += food.serving_weight_grams;
                } else {
                  console.log("Error: Food item missing required data.");
                }
              }
            }
  
            this.recipeService.edit({ 
              id: parseInt(this.route.snapshot.paramMap.get('id')),
              name: this.profileForm.controls['name']?.value,
              ingrediencie: this.profileForm.controls['ingrediencie']?.value,
              description: this.profileForm.controls['description']?.value,
              imgURL: this.profileForm.controls['imgURL']?.value,
              cas: this.profileForm.controls['cas']?.value,
              postupicky: (this.profileForm.get('postupicky') as FormArray)?.value,
              tuky: Math.ceil(this.dTuky),
              cukor: Math.ceil(this.dCukor),
              sacharidy: Math.ceil(this.dSacharidy),
              bielkoviny: Math.ceil(this.dBielkoviny),
              kalorie: Math.ceil(this.dKalorie),
              gramaz: Math.ceil(this.dGramaz),
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe(editResult => {
              this.recipe.set(editResult);
            });
          },
          error => {
            console.error("Error getting calories:", error);
          }
        );
            
  this.clicked = false;
    }
 addComment(){
  
  var inputBox = (<HTMLInputElement>document.getElementById("koment"));
  var inputValue = (<HTMLInputElement>document.getElementById("koment")).value;
  const id = parseInt(this.route.snapshot.paramMap.get('id'));
  var date = this.datePipe.transform(new Date(), 'yyyy, MMM d, h:mm a');

  this.recipeService.letsAddComment({content: inputValue, recipesID: id, datetime: date})
  .pipe(takeUntil(this.destroy$))
  .subscribe(value => {console.log(value); 
    this.recensions.update(actualRecension => [...actualRecension, value])} );
   
    this.scrollToBottom();
    inputBox.value = "";

}

  likeRecension(id: number) {
    
    this.recipeService.likeRecension(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.recensions.update(data => data.map(recension => recension.id === id ?
          { recipesID: value.recipesID,
            content: value.content,
            datetime: value.datetime,
            id: value.id, 
            amountOfLikes: value.amountOfLikes, 
            userName: value.userName,
            amountOfDisslikes: value.amountOfDisslikes,
            userID: value.userID,
            checkID: value.checkID,
          profileName: value.profileName } : recension))
        console.log(value);
      }

      );

  }
disslikeRecension(id: number){
  this.recipeService.disslikeRecension(id)
  .pipe(takeUntil(this.destroy$))
  .subscribe(value => {
    this.recensions.update(data => data.map(recension => recension.id === id ?
      { recipesID: value.recipesID,
        datetime: value.datetime,
        content: value.content,
        id: value.id, 
        amountOfLikes: value.amountOfLikes, 
        userName: value.userName,
        amountOfDisslikes: value.amountOfDisslikes,
        userID: value.userID,
        checkID: value.checkID
      , profileName: value.profileName } : recension))
    console.log(value);
  }

  );
}
get postupicky() {
  return this.profileForm.get('postupicky') as FormArray;
  
}

scrollToBottom() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  });
}

Vymaz(id: number){
  
  this.recipeService.removeRecension(id)
  .pipe(takeUntil(this.destroy$))
  .subscribe(value => this.recensions.update(items => items.filter(item => item.id !== id)));
}









































}



export class EditDTO{
  id?:number;
  difficulty?: string;
  name?: string;
  ingrediencie?: string;
  description?: string;
  imgURL?: string;
  cas?: number;
  postupicky?: string[];
  tuky?:number;
  cukor?:number;
  sacharidy?:number;
  bielkoviny?:number;
  kalorie?:number;
  gramaz?:number;
}
