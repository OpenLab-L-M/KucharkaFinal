import { Pipe, PipeTransform } from '@angular/core';
import { RecipesDTO } from 'src/app/recipes/RecipesDTO';

@Pipe({
  standalone: true,
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: RecipesDTO[], sSearchRecept: string): RecipesDTO[] {


    if (!items) { return []; }


    if (!sSearchRecept) { return items; }

 
    sSearchRecept = sSearchRecept.toLowerCase();
    const difficultiesArray = sSearchRecept.split(" ");
    const difficulty1 = difficultiesArray[0];
    const difficulty2 = difficultiesArray[1];
    const difficulty3 = difficultiesArray[2];


    return items.filter(item => {
      if (item && item.difficulty) {
        
        const difficultyMatches = difficultiesArray.includes(item.difficulty.toLowerCase());

        
        const veganskeMatches = difficultiesArray.includes('vegan') && item.veganske === true;
        const vegetarianskeMatches = difficultiesArray.includes('vegetarian') && item.vegetarianske === true;
        const nizkoKalorickeMatches = difficultiesArray.includes('lowcalorie') && item.nizkoKaloricke === true;

        
        return difficultyMatches || veganskeMatches || vegetarianskeMatches || nizkoKalorickeMatches;
      }
      return false;
    });
  }
}