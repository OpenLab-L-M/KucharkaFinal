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

    // Debugging: Log the filters array
    console.log('Filters Array:', filtersArray);

    // Filter recipes based on all selected categories
    return items.filter(item => {
      if (item) {
        // Debugging: Log the item and its properties
  

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
        //raňajky obedy a večere filter
        const obedyMatches = filtersArray.includes('obedy') ? item.obed : true 
        const ranajkyMatches = filtersArray.includes('ranajky') ? item.ranajky : true 
        const vecereMatches = filtersArray.includes('vecere') ? item.vecera : true 
        // Proteinový Prášok Filter
        const proteinovyPrasokMatches = filtersArray.includes('proteinovy') && filtersArray.includes('prasok')
          ? (item.ingrediencie
              ? item.ingrediencie.toLowerCase().includes('proteinový prášok')
              : false)
          : true;

        // Do 5 Surovin Filter
        const do5SurovinMatches = filtersArray.includes('do') && filtersArray.includes('5') && filtersArray.includes('surovin')
          ? (item.ingrediencie
              ? item.ingrediencie
                  .split(",")
                  .filter(ingredient => ingredient.trim() !== "") // Remove empty strings
                  .length <= 5 // Check if the number of ingredients is <= 5
              : false)
          : true;

        // Time Filters
        const do30MinutMatches = filtersArray.includes('do') && filtersArray.includes('30') && filtersArray.includes('minút')
          ? (item.cas ? item.cas <= 30 : false)
          : true;

        const do60MinutMatches = filtersArray.includes('do') && filtersArray.includes('60') && filtersArray.includes('minút')
          ? (item.cas ? item.cas <= 60 : false)
          : true;

        const do90MinutMatches = filtersArray.includes('do') && filtersArray.includes('90') && filtersArray.includes('minút')
          ? (item.cas ? item.cas <= 90 : false)
          : true;

        const do120MinutMatches = filtersArray.includes('do') && filtersArray.includes('120') && filtersArray.includes('minút')
          ? (item.cas ? item.cas <= 120 : false)
          : true;

        const vsetkyCasoveMatches = filtersArray.includes('vsetky') && filtersArray.includes('casove')
          ? true
          : true; // No time filter applied

        return (
          searchBarMatches &&
          difficultyMatches &&
          obedyMatches &&
          ranajkyMatches &&
          vecereMatches &&
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
