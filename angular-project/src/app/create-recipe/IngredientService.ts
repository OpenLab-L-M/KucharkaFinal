import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IngredienceDTO } from '../DTOs/IngredienceDTO';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  selectedIngredients: string = '';
  http = inject(HttpClient);

  constructor( ) { }
  updateListuBezRefreshu(ingredience: string){
    return this.http.post<string>('https://localhost:7186/ingredience/addIngredienceDragAndDrop', ingredience);
  }
}
