import { Component, inject, signal } from '@angular/core';
import {forkJoin, Subject, takeUntil} from 'rxjs';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { RecipesDTO } from './RecipesDTO';
import { RecipesService } from 'src/services/recipes.service';
import { UserService } from 'src/services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FilterPipe } from 'src/pipes/filter-pipe.pipe';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltip } from '@angular/material/tooltip';
import { ElementRef, ViewChild } from '@angular/core';
import { NgModule } from '@angular/core';
import { createRecipe } from '../create-recipe/createRecipe';
import { UserDTO } from '../user-profile/UserDTO';
import {ImageDTO} from "./ImageDTO";
import {CreatorDTO} from "./CreatorDTO";
import { MatInput } from '@angular/material/input';
import { NgArrayPipesModule } from 'ngx-pipes';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatToolbar } from '@angular/material/toolbar';
import { MatFormField } from '@angular/material/input';
import { MatLabel } from '@angular/material/input';
import { DecimalPipe } from '@angular/common';


@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [
    RouterLink,
    NgFor,
    MatIcon,
    NgIf,
    FilterPipe,
    MatButtonModule,
    MatTooltip,
    MatCardModule,
    MatSidenavModule,
    FormsModule,
    MatListItem,
    MatToolbar,
    MatFormField,
    MatLabel,
     MatNavList,
     DecimalPipe
  ],

  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss'
})
export class RecipesComponent {
  imageDTO: ImageDTO[] = [];
  userImages: CreatorDTO[] = [];
  ktoryRecept(id: number){
    
    const checkbox = document.getElementById('favourite') as HTMLInputElement;
    const isChecked = (event.target as HTMLInputElement).checked;
    if(isChecked){
      this.recipeService.addToFav(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
    }
    
    }
  portions = signal<number>(undefined);
  recipeService = inject(RecipesService);
  private destroy$ = new Subject<void>();
  recipe = signal<RecipesDTO>(undefined);


  useris: UserDTO;
  realRecipes = signal<RecipesDTO[]>([])

  easyChecked: boolean = false;
  mediumChecked: boolean = false;
  hardChecked: boolean = false;
  veganChecked: boolean = false;
  vegetarianChecked: boolean = false;
  lowCalorieChecked: boolean = false

  sSearchRecept: string = '';
  constructor(private userService: UserService,) { }
  ngOnInit(): void {

    
    forkJoin({
      recipes: this.recipeService.getRecipesList(),
      currentUser: this.userService.getCurrentUser(),
      images: this.recipeService.getAllImages(),
      userCreators: this.userService.getAllCreatorImages()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.realRecipes.set(result.recipes);
        this.useris = result.currentUser;
        this.imageDTO = result.images;
        this.userImages = result.userCreators;
        this.comprim();
        
      });


  }

  comprim() {
    this.realRecipes().forEach(a =>
      a.comprimedImage = `data:image/jpeg;base64,${this.userImages.find(b => b.id === a.userID).pictureURL}`,

    )

  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  join: String = "";

  filterRecipesByDifficulty(difficulty: string): void {
    if (this.join.includes(difficulty)) {
      this.join = this.join.replace(difficulty + " ", "");
    } else {
      this.join += difficulty + " ";
    }
  }

  call() {
    const difficultiesArray = this.join.trim().split(" ");
    this.sSearchRecept = difficultiesArray.join(" ").toLowerCase();
  }

  clearFilter(): void {
    this.sSearchRecept = '';
    this.join = '';

    this.easyChecked = false;
    this.mediumChecked = false;
    this.hardChecked = false;
    this.veganChecked = false;
    this.vegetarianChecked = false;
    this.lowCalorieChecked = false;
  }


    getImage(id: number, ) {
     return `data:image/jpeg;base64,${this.imageDTO.find(image => image.id === id).image}`;
  }


}
