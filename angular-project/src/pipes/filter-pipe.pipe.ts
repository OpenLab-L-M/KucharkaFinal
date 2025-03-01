import { Pipe, PipeTransform } from '@angular/core';
import { RecipesDTO } from 'src/app/recipes/RecipesDTO';

@Pipe({
  standalone: true,
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: RecipesDTO[], sSearchRecept: string, searchBarQuery?: string): RecipesDTO[] {
    if (!items) { return []; }

    // If no filters are applied, return all items
    if (!sSearchRecept && !searchBarQuery) { return items; }

    // Convert the search string to lowercase
    sSearchRecept = sSearchRecept ? sSearchRecept.toLowerCase() : '';
    searchBarQuery = searchBarQuery ? searchBarQuery.toLowerCase() : '';

    // Split the search string into an array of filters
    const filtersArray = sSearchRecept ? sSearchRecept.split(" ") : [];

    // Filter recipes based on all selected categories
    return items.filter(item => {
      if (item) {
        // Search Bar Filter (filter by recipe name)
        const searchBarMatches = searchBarQuery
          ? item.name.toLowerCase().includes(searchBarQuery)
          : true;

        // Difficulty Filter (only applies if a difficulty is selected)
        const difficultyMatches = filtersArray.some(filter =>
          ['lahke', 'pokrocile', 'narocne'].includes(filter)
        )
          ? (item.difficulty ? filtersArray.includes(item.difficulty.toLowerCase()) : false)
          : true;

        // Dietary Filters
        const veganskeMatches = filtersArray.includes('veganske') ? item.veganske : true;
        const vegetarianskeMatches = filtersArray.includes('vegetarianske') ? item.vegetarianske : true;

        // Course Filters
        const salatyMatches = filtersArray.includes('salaty') ? item.name.includes('šalát') : true;
        const polievkyMatches = filtersArray.includes('polievky') ? item.name.includes('polievka') : true;
        const natierkyMatches = filtersArray.includes('natierky') ? item.name.includes('nátierka') : true;

        // Preference Filters
        const cukorMatches = filtersArray.includes('cukor') ? item.cukor / (item.gramaz / 100) === 0 : true;
        const bielkovinyMatches = filtersArray.includes('bielkoviny') ? item.bielkoviny / (item.gramaz / 100) >= 10 || item.bielkoviny >= 30 : true;
        const sacharidyMatches = filtersArray.includes('sacharidy') ? item.sacharidy / (item.gramaz / 100) <= 10 : true;
        const kalorieMatches = filtersArray.includes('kalorie') ? item.kalorie <= 500 : true;
        const tukMatches = filtersArray.includes('tuk') ? item.tuky / (item.gramaz / 100) <= 3 : true;
        const proteinovyPrasokMatches = filtersArray.includes('proteinovy prasok') ? item.ingrediencie.toLowerCase().includes('proteinový prášok') : true;
        const do5SurovinMatches = filtersArray.includes('do 5 surovin') ? item.ingrediencie.split(",").length <= 5 : true;

        // Time Filters
        const do30MinutMatches = filtersArray.includes('do 30 minút') ? item.cas <= 30 : true;
        const do60MinutMatches = filtersArray.includes('do 60 minút') ? item.cas <= 60 : true;
        const do90MinutMatches = filtersArray.includes('do 90 minút') ? item.cas <= 90 : true;
        const do120MinutMatches = filtersArray.includes('do 120 minút') ? item.cas <= 120 : true;
        const vsetkyCasoveMatches = filtersArray.includes('vsetky casove') ? true : true; // No time filter applied

        // Combine all conditions with AND (&&)
        return (
          searchBarMatches &&
          difficultyMatches &&
          veganskeMatches &&
          vegetarianskeMatches &&
          salatyMatches &&
          polievkyMatches &&
          natierkyMatches &&
          cukorMatches &&
          bielkovinyMatches &&
          sacharidyMatches &&
          kalorieMatches &&
          tukMatches &&
          proteinovyPrasokMatches &&
          do5SurovinMatches &&
          do30MinutMatches &&
          do60MinutMatches &&
          do90MinutMatches &&
          do120MinutMatches &&
          vsetkyCasoveMatches
        );
      }
      return false;
    });
  }
}