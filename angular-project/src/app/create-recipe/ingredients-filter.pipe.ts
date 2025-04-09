import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'ingredientsFilter',
  standalone: true
})
export class IngredientsFilterPipe implements PipeTransform {

  transform( ingredients: string[], searchTerm: string, dummy: number): string[] {
    return !searchTerm
    ? ingredients
    : ingredients.filter(
        (item) =>
          item.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }

}
