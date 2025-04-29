import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { RecipesDTO } from 'src/app/DTOs/RecipesDTO'
import { createRecipe } from '../app/create-recipe/createRecipe';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EditDTO } from 'src/app/recipes-details/recipes-details.component';
import {ImageDTO} from "../app/DTOs/ImageDTO";
import { RecensionsDTO } from 'src/app/DTOs/recensions-dto';
import { FormArray } from '@angular/forms';
import { paginatorData } from 'src/app/DTOs/PaginatorData';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private recipesURL = this.baseUrl + '/recipes/';

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private route: ActivatedRoute) { }
   public chRecipe= new  RecipesDTO;
  getRecipesList() {
    return this.http.get<RecipesDTO[]>(this.recipesURL)
  }

  getClickedRecipes(Id: number) {
    return this.http.get<RecipesDTO>(this.recipesURL + Id);
  }

  getImage(Id: number) {
    return this.http.get<ImageDTO>(this.baseUrl + "/getImage/" + Id);
  }

  getAllImages(): Observable<ImageDTO[]> {
    return this.http.get<ImageDTO[]>(this.baseUrl + "/getAllImages");
  }
  //gemini api key: AIzaSyDsaNk1Gesqy1mFhA5Maj-w83uUClWzr-8
  //chatbot API: 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
  CreateRecipe(RecipesDTO: {
    difficulty: string;
    ingrediencie: string;
    postupicky?: FormArray;
    imageId: Number;
    cas: any;
    veganske: any;
    vegetarianske: any;
    bezlepkove: any;
    imageURL: string;
    name: string;
    description: string
    tuky?:number;
    cukor?:number;
    sacharidy?:number;
    bielkoviny?:number;
    ranajky?:any;
    obed?: any;
    vecera?:any;
    kalorie?:number;
    gramaz?:number;
  }) {
    return this.http.post<createRecipe>(this.baseUrl + '/CreateRecipe', RecipesDTO)
  }
  deleteGuild(Id: number) {

    return this.http.delete<string>(this.recipesURL + Id);
  }
  addToFav(id: number){
    return this.http.post<RecipesDTO>(this.recipesURL + "AddToFav/" + id, id);
  }
  edit(upraveny: EditDTO){
    return this.http.put<RecipesDTO>(this.recipesURL + "Editujem", upraveny);
  }
  letsAddComment(recenzia: RecensionsDTO){
    return this.http.post<RecensionsDTO>(this.recipesURL + "PridajRecenziu",recenzia);
  }
  getRecension(id: number){
    return this.http.get<RecensionsDTO[]>(this.recipesURL + "recenzie/" + id);
  }
  likeRecension(recensionId: number){
    return this.http.post<RecensionsDTO>(this.recipesURL + "likeRecension/" + recensionId, recensionId);
  }
  returnRandomRecipe(){
    return this.http.get<RecipesDTO[]>(this.baseUrl + "/Homepage/returnRandomRecipe")
  }
  disslikeRecension(recensionId: number){
    return this.http.post<RecensionsDTO>(this.recipesURL + "disslikeRecension/" + recensionId, recensionId);
  }
  removeRecension(recensionId: number){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<RecensionsDTO>(this.recipesURL + "removeRecension/" + recensionId, {headers});
  }
  setIngredients(){
    return this.http.get<string[]>(this.baseUrl + "/CreateRecipe/Ingredients")
  }
  getCalories(query: string){
     let apiKey = '1238dfcba9dc54bb7ff8f93acc107ad6'; // Replace with your actual API key
     let apiUrl = 'https://trackapi.nutritionix.com/v2/natural/nutrients';
  

     const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-app-id': '46f0545f',
          'x-app-key': apiKey,

      }),
  };

const body = {
      query: query, // You should be encoding it here.
  };

return this.http.post(apiUrl, body, httpOptions);
}
returnTranslation(ingr: string){
  return this.http.post<string>(this.baseUrl + "/translate/" + ingr, ingr)
}
deleteIngredient(ingr: string){
  return this.http.delete(this.baseUrl + '/deleteIngredient/' + ingr);
}
getPaginatedRecipes(nojo: paginatorData){
  return this.http.post<RecipesDTO[]>(this.baseUrl + '/GetPaginated',nojo)
}
}
