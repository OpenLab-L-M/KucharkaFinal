import { IngredienceDTO } from "../create-recipe/IngredienceDTO";

export class RecipesDTO{
    id: number;
    name?: string;
    description?: string;
    postupicky?: Array<string>;
    ingrediencie?: string;
    difficulty?: string;
    imageURL?: string;
    pictureURL?: string;
    checkID: string;
    userID: string;
    recipesID?: number;
    cas?: number;
    veganske?: boolean;
    vegetarianske?: boolean;
    nizkoKaloricke?: boolean;
    tuky?:number;
    cukor?:number;
    sacharidy?:number;
    bielkoviny?:number;
    kalorie?:number;
    image: number;
    comprimedImage: any;
  }
