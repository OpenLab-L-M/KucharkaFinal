import { IngredienceDTO } from "./IngredienceDTO";

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
    ranajky?:boolean;
    obed?: boolean;
    vecera?:boolean;
    nizkoKaloricke?: boolean;
    tuky?:number;
    cukor?:number;
    sacharidy?:number;
    bielkoviny?:number;
    kalorie?:number;
    gramaz?:number;
    image: number;
    admin?: boolean;
    favourite?: boolean;
    comprimedImage: any;

  }
