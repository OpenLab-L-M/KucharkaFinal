import { Component, OnInit, inject, signal } from '@angular/core';
import { RecipesService } from 'src/services/recipes.service';
import { RecipesDTO } from '../recipes/RecipesDTO';
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
import { RecensionsDTO } from './recensions-dto';

import {CreatorDTO} from 'src/app/recipes/CreatorDTO';
import { DataSource } from '@angular/cdk/collections';
import { MatPseudoCheckbox } from '@angular/material/core';
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


  extractAllNumbersFromString(str: string): number[] {
    const matches = str.matchAll(/(\d+)(?:g)?/g); // Note the 'g' flag for global match
    const numbers: number[] = [];
  
    if (matches) {
      for (const match of matches) {
        const numberString = match[1];
        const number = parseInt(numberString, 10);
  
        if (!isNaN(number)) {
          numbers.push(number);
        }
      }
    }
  
    return numbers;
  }
  calorieCounter(){

  }





  ngOnInit(): void {
    

    const id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.recipeService.getClickedRecipes(id)
       .subscribe(result => {
        this.recipeService.chRecipe = result;
        this.recipe.set(result);
        console.log(this.extractAllNumbersFromString(result.ingrediencie))
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
    .subscribe(value => {this.recensions.set(value);
        console.log(value)}
    );

    this.recipeService.getImage(id).subscribe(value =>
      this.image = value.image
    )
    console.log(parseInt(this.route.snapshot.paramMap.get('id')));
    
    
    //console.log(this.currentDate);
   }


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
submit(){
  
  const id = parseInt(this.route.snapshot.paramMap.get('id'));
  this.recipeService.edit({
    id: parseInt(this.route.snapshot.paramMap.get('id')),
    name: this.profileForm.controls['name']?.value,
    ingrediencie: this.profileForm.controls['ingrediencie']?.value,
    description: this.profileForm.controls['description']?.value,
      imgURL: this.profileForm.controls['imgURL']?.value,
      cas: this.profileForm.controls['cas']?.value,
      postupicky: (this.profileForm.get('postupicky') as FormArray)?.value

  })
  .pipe(takeUntil(this.destroy$))
  .subscribe(result => this.recipe.set(result));
  this.clicked=false;
  
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
            checkID: value.checkID } : recension))
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
        checkID: value.checkID } : recension))
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
}
