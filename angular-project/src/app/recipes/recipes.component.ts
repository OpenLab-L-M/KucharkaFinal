import { Component, HostListener, inject, signal } from '@angular/core';
import {forkJoin, Subject, takeUntil} from 'rxjs';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { RecipesDTO } from '../DTOs/RecipesDTO';
import { RecipesService } from 'src/services/recipes.service';
import { UserService } from 'src/services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FilterPipe } from 'src/pipes/filter-pipe.pipe';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltip } from '@angular/material/tooltip';
import { ElementRef, ViewChild } from '@angular/core';
import { NgModule } from '@angular/core';
import { createRecipe } from '../create-recipe/createRecipe';
import { UserDTO } from '../DTOs/UserDTO';
import {ImageDTO} from "../DTOs/ImageDTO";
import {CreatorDTO} from "../DTOs/CreatorDTO";
import { MatInput } from '@angular/material/input';
import { NgArrayPipesModule } from 'ngx-pipes';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatToolbar } from '@angular/material/toolbar';
import { MatFormField } from '@angular/material/input';
import { MatLabel } from '@angular/material/input';
import { DecimalPipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';


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
     DecimalPipe,
     MatCheckboxModule
  ],

  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss'
})
export class RecipesComponent {
  imageDTO: ImageDTO[] = [];
  userImages: CreatorDTO[] = [];
  isFavourite(recipeId: number): boolean {
    return this.favRecipes.some(fav => fav.id === recipeId);
  }
  ktoryRecept(id: number){
    
    const checkbox = document.getElementById('favourite') as HTMLInputElement;
      this.recipeService.addToFav(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
    
    
    }
  portions = signal<number>(undefined);
  recipeService = inject(RecipesService);
  private destroy$ = new Subject<void>();
  recipe = signal<RecipesDTO>(undefined);


  favRecipes: RecipesDTO[] = [];    
  searchBarQuery: string;

  useris: UserDTO;
  realRecipes = signal<RecipesDTO[]>([])
  easyChecked: boolean = false;
  mediumChecked: boolean = false;
  hardChecked: boolean = false;

  // Dietary Filters
  veganChecked: boolean = false;
  vegetarianChecked: boolean = false;

  // Course Filters
  ranajkyChecked: boolean = false;
  obedyChecked: boolean = false;
  vecereChecked: boolean = false;
  salatyChecked: boolean = false;
  soupsChecked: boolean = false;
  natierkyChecked: boolean = false;

  // Preference Filters
  sugarChecked: boolean = false;
  proteinChecked: boolean = false;
  carbohydratesChecked: boolean = false;
  caloriesChecked: boolean = false;
  fatsChecked: boolean = false;
  proteinPowderChecked: boolean = false;
  upTo5IngredientsChecked: boolean = false;
  intoBoxChecked: boolean = false;

  // Time Filters
  halfHourChecked: boolean = false;       // do 30 minút
  hourMinsChecked: boolean = false;      // do 60 minút
  hourAndHalfChecked: boolean = false;   // do 90 minút
  twoHoursChecked: boolean = false;      // do 120 minút
  allMinsChecked: boolean = false;       // všetky časové kategórie











  sSearchRecept: string = '';
  constructor(private userService: UserService, ) {
    this.checkScreenSize(); // Check screen size on initialization
   }
  ngOnInit(): void {

    
    forkJoin({
      recipes: this.recipeService.getRecipesList(),
      favRecipes: this.userService.getFavourites(),
      currentUser: this.userService.getCurrentUser(),
      images: this.recipeService.getAllImages(),
      userCreators: this.userService.getAllCreatorImages()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.realRecipes.set(result.recipes);
        this.useris = result.currentUser;
        this.favRecipes = result.favRecipes;
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
    console.log(this.join);
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
    this.ranajkyChecked = false;
    this.obedyChecked = false;
    this.vecereChecked = false;
    this.salatyChecked = false;
    this.soupsChecked = false;
    this.natierkyChecked = false;
    this.sugarChecked = false;
    this.proteinChecked = false;
    this.carbohydratesChecked = false;
    this.caloriesChecked = false;
    this.fatsChecked = false;
    this.proteinPowderChecked = false;
    this.upTo5IngredientsChecked = false;
    this.intoBoxChecked = false;
    this.halfHourChecked = false;
    this.hourMinsChecked = false;
    this.hourAndHalfChecked = false;
    this.twoHoursChecked = false;
    this.allMinsChecked = false;

    // Clear search input
    this.sSearchRecept = '';
    
  }


    getImage(id: number, ) {
     return `data:image/jpeg;base64,${this.imageDTO.find(image => image.id === id).image}`;
  }

  isSidebarOpen = true; // Sidebar is open by default
  isMobile = false; // Track if the screen is mobile

  @ViewChild('drawer') drawer!: MatDrawer; // Reference to the sidebar drawer



  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.drawer.toggle(); // Toggle the sidebar drawer
  }

  // Check screen size and update isMobile
  @HostListener('window:resize', ['$event'])
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768; // Mobile breakpoint at 768px
    if (this.isMobile) {
      this.isSidebarOpen = false; // Close sidebar by default on mobile
    } else {
      this.isSidebarOpen = true; // Open sidebar by default on desktop
    }
  }

}
