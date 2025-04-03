import { Pipe, PipeTransform } from '@angular/core';
import { RecipesDTO } from 'src/app/DTOs/RecipesDTO';

@Pipe({
  standalone: true,
  pure: false,
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  /**
   * Filters an array of RecipesDTO based on various criteria.
   * @param items The array of recipes to filter.
   * @param otherFiltersString A space-separated string of general filter keywords (difficulty, dietary, course, time, preferences excluding specific ingredients).
   * @param ingredientFilters An array of strings, where each string is an ingredient to filter by.
   * @param searchBarQuery Optional string to filter recipes by name.
   * @returns The filtered array of recipes.
   */
  transform(
    items: RecipesDTO[],
    otherFiltersString: string,
    ingredientFilters: string[],
    searchBarQuery?: string
  ): RecipesDTO[] {

    // 1. Initial Checks
    if (!items) { return []; }

    // Prepare filters - convert to lowercase and handle empty/null values
    const cleanSearchQuery = searchBarQuery ? searchBarQuery.trim().toLowerCase() : '';
    const cleanOtherFiltersString = otherFiltersString ? otherFiltersString.trim().toLowerCase() : '';
    // Ensure ingredientFilters is an array and clean its contents
    const cleanIngredientFilters = Array.isArray(ingredientFilters)
        ? ingredientFilters.map(ing => ing.trim().toLowerCase()).filter(ing => ing !== '') // Trim, lowercase, remove empty
        : [];

    // Split the general filter string into an array
    const otherFiltersArray = cleanOtherFiltersString ? cleanOtherFiltersString.split(" ") : [];

    // If no filters are applied at all, return original items
    if (!cleanSearchQuery && otherFiltersArray.length === 0 && cleanIngredientFilters.length === 0) {
      return items;
    }

    // 2. Filtering Logic
    return items.filter(item => {
      // Skip if item is somehow null/undefined
      if (!item) {
        return false;
      }

      // --- Filter Calculations ---

      // A. Search Bar Filter (by recipe name)
      const searchBarMatches = cleanSearchQuery
        ? item.name?.toLowerCase().includes(cleanSearchQuery) // Add safe navigation for name
        : true; // No search query means it matches

      // B. Difficulty Filter
      const difficultyTerms = ['ľahké', 'pokročilé', 'náročné'];
      const selectedDifficulty = otherFiltersArray.find(f => difficultyTerms.includes(f));
      const difficultyMatches = !selectedDifficulty // No difficulty filter selected
        ? true
        : item.difficulty // Recipe has difficulty
          ? item.difficulty.toLowerCase() === selectedDifficulty
          : false; // Difficulty filter selected, but recipe has no difficulty

      // C. Dietary Filters
      const veganskeMatches = otherFiltersArray.includes('veganske') ? !!item.veganske : true; // Use !! to ensure boolean
      const vegetarianskeMatches = otherFiltersArray.includes('vegetarianske') ? !!item.vegetarianske : true;

      // D. Course Filters (Based on keywords in name)
      const salatyMatches = otherFiltersArray.includes('salaty') ? item.name?.toLowerCase().includes('šalát') : true;
      const polievkyMatches = otherFiltersArray.includes('polievky') ? item.name?.toLowerCase().includes('polievka') : true;
      const natierkyMatches = otherFiltersArray.includes('natierky') ? item.name?.toLowerCase().includes('nátierka') : true;

       // E. Meal Type Filters (Based on boolean flags)
       const obedyMatches = otherFiltersArray.includes('obedy') ? !!item.obed : true;
       const ranajkyMatches = otherFiltersArray.includes('ranajky') ? !!item.ranajky : true;
       const vecereMatches = otherFiltersArray.includes('vecere') ? !!item.vecera : true;


      // F. Preference Filters (Macros, Calories, etc.)
      // Ensure gramaz is not zero to avoid division by zero errors
      const gramsPer100 = item.gramaz && item.gramaz > 0 ? (item.gramaz / 100) : 1; // Default to 1 if gramaz is invalid/zero
      const cukorMatches = otherFiltersArray.includes('cukor') ? (item.cukor != null ? (item.cukor / gramsPer100) === 0 : false) : true;
      const bielkovinyMatches = otherFiltersArray.includes('bielkoviny') ? (item.bielkoviny != null ? (item.bielkoviny / gramsPer100 >= 10 || item.bielkoviny >= 30) : false) : true;
      const sacharidyMatches = otherFiltersArray.includes('sacharidy') ? (item.sacharidy != null ? (item.sacharidy / gramsPer100) <= 10 : false) : true;
      const kalorieMatches = otherFiltersArray.includes('kalorie') ? (item.kalorie != null ? item.kalorie <= 500 : false) : true;
      const tukMatches = otherFiltersArray.includes('tuk') ? (item.tuky != null ? (item.tuky / gramsPer100) <= 3 : false) : true;

      // G. Special Preference Filters (Check based on keyword presence)
      // Assumes "proteinovy prasok" is a single term in otherFiltersArray if selected
      const proteinovyPrasokMatches = otherFiltersArray.includes('proteinovy prasok')
        ? (item.ingrediencie ? item.ingrediencie.toLowerCase().includes('proteinový prášok') : false)
        : true;

      // Assumes "do 5 surovin" is a single term in otherFiltersArray if selected
      const do5SurovinMatches = otherFiltersArray.includes('do 5 surovin')
        ? (item.ingrediencie
          ? item.ingrediencie.split(",").filter(ingredient => ingredient.trim() !== "").length <= 5
          : false)
        : true;

      // H. Time Filters (Based on keywords)
      // Needs careful handling if multiple time filters can be selected. Assuming only one.
      const timeFilterSelected = otherFiltersArray.some(f => ['do 30 minút', 'do 60 minút', 'do 90 minút', 'do 120 minút', 'vsetky casove'].includes(f));
      let timeMatches = true; // Default to true if no time filter or 'vsetky casove' is selected

      if (timeFilterSelected && !otherFiltersArray.includes('vsetky casove')) {
           if (item.cas == null) { // If time filter selected, but recipe has no time
               timeMatches = false;
           } else {
               timeMatches =
                   (otherFiltersArray.includes('do 30 minút') && item.cas <= 30) ||
                   (otherFiltersArray.includes('do 60 minút') && item.cas <= 60) ||
                   (otherFiltersArray.includes('do 90 minút') && item.cas <= 90) ||
                   (otherFiltersArray.includes('do 120 minút') && item.cas <= 120);
               // This logic might need adjustment if multiple time ranges can be selected simultaneously.
               // Currently, it passes if *any* selected time range matches.
               // If only ONE time checkbox can be active, this is simpler: find the active one and check item.cas.
           }
      }


      // I. Ingredient Filter (Uses the separate ingredientFilters array)
      const ingredientsMatch = cleanIngredientFilters.length === 0
        ? true // No ingredient filters applied, so it's a match
        : item.ingrediencie // Check if recipe HAS ingredients listed
          ? cleanIngredientFilters.every(filterIng => // Check if EVERY filter ingredient...
              item.ingrediencie
                .toLowerCase() // Lowercase recipe ingredients once for efficiency
                .split(',')
                .some(recipeIng => // ...is found (as substring) in ANY of the recipe's ingredients
                  recipeIng.trim().includes(filterIng) // filterIng is already lowercase and trimmed
                )
            )
          : false; // Ingredient filters applied, but recipe has no ingredients listed


      // 3. Combine all filter results
      return (
        searchBarMatches &&
        difficultyMatches &&
        veganskeMatches &&
        vegetarianskeMatches &&
        salatyMatches &&
        polievkyMatches &&
        natierkyMatches &&
        obedyMatches &&       // Added meal types
        ranajkyMatches &&
        vecereMatches &&
        cukorMatches &&
        bielkovinyMatches &&
        sacharidyMatches &&
        kalorieMatches &&
        tukMatches &&
        proteinovyPrasokMatches &&
        do5SurovinMatches &&
        timeMatches &&      // Use the combined timeMatches variable
        ingredientsMatch   // Use the new ingredientsMatch variable
      );
    });
  }
}