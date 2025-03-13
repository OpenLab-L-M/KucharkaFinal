import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { ImageDTO } from '../DTOs/ImageDTO';
import { CreatorDTO } from '../DTOs/CreatorDTO';
import { RecipesService } from 'src/services/recipes.service';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { RecipesDTO } from '../DTOs/RecipesDTO';
import { UserService } from 'src/services/user.service';
import { UserDTO } from '../DTOs/UserDTO';
import { NgFor, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FilterPipe } from 'src/pipes/filter-pipe.pipe';
import { MatCardModule } from '@angular/material/card';
import { MatTooltip } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [ MatButtonModule, RouterLink,
    NgFor,
    MatIcon,
    NgIf,
    FilterPipe,
    MatButtonModule,
    MatTooltip,
    MatCardModule,
    MatSidenavModule,
    FormsModule
   ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  recipeService = inject(RecipesService);
  imageDTO: ImageDTO[] = [];
  useris: UserDTO;
  userImages: CreatorDTO[] = [];
  private destroy$ = new Subject<void>();
  constructor (private userService: UserService){}
  realRecipes: RecipesDTO[] = [];
  ktoryRecept(id: number){
    debugger
    const checkbox = document.getElementById('favourite') as HTMLInputElement;
    const isChecked = (event.target as HTMLInputElement).checked;
    if(isChecked){
      this.recipeService.addToFav(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
    }
    }
  ngOnInit(): void {


    forkJoin({
      recipes: this.recipeService.returnRandomRecipe(),
      currentUser: this.userService.getCurrentUser(),
      images: this.recipeService.getAllImages(),
      userCreators: this.userService.getAllCreatorImages()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.realRecipes = result.recipes;
        this.useris = result.currentUser;
        this.imageDTO = result.images;
        this.userImages = result.userCreators;
        this.comprim();
      });


  }

  comprim() {
    this.realRecipes.forEach(a =>
      a.comprimedImage = `data:image/jpeg;base64,${this.userImages.find(b => b.id === a.userID).pictureURL}`,

    )

  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  join: String = "";
  
  getImage(id: number, ) {
    return `data:image/jpeg;base64,${this.imageDTO.find(image => image.id === id).image}`;
 }
 
 sSearchRecept: string = '';
 call() {
  const difficultiesArray = this.join.trim().split(" ");
  this.sSearchRecept = difficultiesArray.join(" ").toLowerCase();
}


}
