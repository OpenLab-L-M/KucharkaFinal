import { Pipe, PipeTransform } from '@angular/core';
import { RecipesDTO } from 'src/app/DTOs/RecipesDTO'; // Make sure this path is correct

// --- Helper Functions (Unchanged) ---
function normalizeString(str: string): string {
  if (!str) return '';
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function cleanRecipeIngredient(str: string): string {
   if (!str) return '';
   let cleaned = str
     .replace(/^[\d\s._-]+(ks|g|kg|ml|l|dkg|pl|hrst|štipka|balenie|konzerva|strúčik|lyžica|lyžička)?\s*/i, '')
     .replace(/\s*[\d\s._-]+(ks|g|kg|ml|l|dkg|pl|hrst|štipka|balenie|konzerva|strúčik|lyžica|lyžička)?\s*$/i, '')
     .replace(/^[^a-zA-ZáäčďéíľĺňóôŕšťúýžÁÄČĎÉÍĽĹŇÓÔŔŠŤÚÝŽ]+/, '')
     .replace(/[.,;:]?$/, '')
     .trim();
   return cleaned;
}

// --- The Pipe ---
@Pipe({
  standalone: true,
  pure: false,
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(
    items: RecipesDTO[],
    otherFiltersString: string,
    ingredientFilters: string[],
    searchBarQuery?: string
  ): RecipesDTO[] {

    // --- Basic Setup (Unchanged) ---
    if (!items) return [];
    const cleanSearchQuery = searchBarQuery ? searchBarQuery.trim().toLowerCase() : '';
    const cleanOtherFiltersString = otherFiltersString ? otherFiltersString.trim().toLowerCase() : '';
    // Use this array for the user's provided logic snippets
    const otherFiltersArray = cleanOtherFiltersString ? cleanOtherFiltersString.split(" ").filter(f => f) : [];
    const normalizedShoppingList = Array.isArray(ingredientFilters)
        ? ingredientFilters.map(ing => normalizeString(ing.trim())).filter(ing => ing !== '')
        : [];
    const noFiltersApplied = !cleanSearchQuery && otherFiltersArray.length === 0 && normalizedShoppingList.length === 0;
    if (noFiltersApplied) return items;

    // Normalize the filters array once for checks that need it (like difficulty)
    const normalizedOtherFiltersArray = otherFiltersArray.map(normalizeString);


    // --- Filtering Logic ---
    return items.filter(item => {
      if (!item) return false;

      // --- Filter Checks ---

      // A. Search Bar
      const searchBarMatches = !cleanSearchQuery || normalizeString(item.name ?? '').includes(normalizeString(cleanSearchQuery));

      // B. Difficulty
      const difficultyTerms = ['ľahké', 'pokročilé', 'náročné'].map(normalizeString);
      const selectedDifficulty = normalizedOtherFiltersArray.find(f => difficultyTerms.includes(f));
      const difficultyMatches = !selectedDifficulty || normalizeString(item.difficulty ?? '') === selectedDifficulty;

      // C. Dietary
      const veganskeMatches = !otherFiltersArray.includes('veganske') || !!item.veganske; // Use original case-sensitive array if keywords are exact
      const vegetarianskeMatches = !otherFiltersArray.includes('vegetarianske') || !!item.vegetarianske;
      const bezlepkoveMatches = !otherFiltersArray.includes('bezlepkove') || !!item.bezlepkove;

      // D. Course
      const normalizedItemName = normalizeString(item.name ?? '');
      const salatyMatches = !otherFiltersArray.includes('salaty') || normalizedItemName.includes('salat');
      const polievkyMatches = !otherFiltersArray.includes('polievky') || normalizedItemName.includes('polievka');
      const natierkyMatches = !otherFiltersArray.includes('natierky') || normalizedItemName.includes('natierka');

      // E. Meal Type
      const obedyMatches = !otherFiltersArray.includes('obedy') || !!item.obed;
      const ranajkyMatches = !otherFiltersArray.includes('ranajky') || !!item.ranajky;
      const vecereMatches = !otherFiltersArray.includes('vecere') || !!item.vecera;

      // F. Preferences (Macros, Calories, etc.)
      const gramsPer100 = item.gramaz && item.gramaz > 0 ? (item.gramaz / 100) : 1;
      const cukorMatches = !otherFiltersArray.includes('cukor') || (item.cukor != null && (item.cukor / gramsPer100) === 0);
      const bielkovinyMatches = !otherFiltersArray.includes('bielkoviny') || (item.bielkoviny != null && (item.bielkoviny / gramsPer100 >= 10));
      const sacharidyMatches = !otherFiltersArray.includes('sacharidy') || (item.sacharidy != null && (item.sacharidy / gramsPer100) <= 10);
      // Low Calorie - using robust check from previous attempts
      const hasKalorieFilter = otherFiltersArray.includes('kalorie');
      let kalorieMatches = true;
      if (hasKalorieFilter) {
        const itemCaloriesNumber = Number(item.kalorie);
        kalorieMatches = !isNaN(itemCaloriesNumber) && itemCaloriesNumber <= 500;
      }
      const tukMatches = !otherFiltersArray.includes('tuk') || (item.tuky != null && (item.tuky / gramsPer100) <= 3);


      // --- G. Special Preferences (USING USER'S PROVIDED SNIPPETS) ---
      // Ensure item.ingrediencie is treated safely (check for null/undefined)
      const ingredientsLower = (item.ingrediencie ?? '').toLowerCase();
      const ingredientsArray = (item.ingrediencie ?? '').split(","); // For length check

      const proteinovyPrasokMatches = otherFiltersArray.includes('proteinovy') && otherFiltersArray.includes('prasok')
        ? ingredientsLower.includes('proteinový prášok') // Check specific accented version
        : true;

      // Refined 'do 5 surovin' check
      const has5SurovinFilter = otherFiltersArray.includes('do') && otherFiltersArray.includes('5') && otherFiltersArray.includes('surovin');
      let do5SurovinMatches = true;
      if (has5SurovinFilter) {
        // Count only non-empty ingredients after trimming
        const ingredientCount = ingredientsArray.map(i => i.trim()).filter(i => i !== '').length;
        do5SurovinMatches = ingredientCount <= 5;
      }


      // --- H. Time Filters (USING USER'S PROVIDED SNIPPETS) ---
      // Note: This logic assumes 'do', '30', 'minút' are separate words in otherFiltersArray
      // Also, it makes multiple limits potentially active simultaneously.
      const timeFilterIsActive = otherFiltersArray.includes('do') && otherFiltersArray.some(f => ['30', '60', '90', '120'].includes(f)) && otherFiltersArray.includes('minút');
      const allTimesIsActive = otherFiltersArray.includes('vsetky') && otherFiltersArray.includes('casove');

      let timeMatches = true; // Default pass

      if (allTimesIsActive) {
          timeMatches = true; // 'vsetky casove' overrides specific limits
      } else if (timeFilterIsActive) {
          // If any specific time limit is active, check if the item matches AT LEAST ONE active limit
          const itemTimeNumber = Number(item.cas); // Ensure item time is a number
          if (isNaN(itemTimeNumber)) {
             timeMatches = false; // Item has invalid time, cannot match specific limit
          } else {
             let meetsAnyLimit = false;
             if (otherFiltersArray.includes('30') && itemTimeNumber <= 30) meetsAnyLimit = true;
             if (otherFiltersArray.includes('60') && itemTimeNumber <= 60) meetsAnyLimit = true;
             if (otherFiltersArray.includes('90') && itemTimeNumber <= 90) meetsAnyLimit = true;
             if (otherFiltersArray.includes('120') && itemTimeNumber <= 120) meetsAnyLimit = true;
             timeMatches = meetsAnyLimit; // Passes if it met any active limit
          }
      }
      // If no time filters active, timeMatches remains true


      // --- I. Ingredients (Shopping List Check - Assumed Correct) ---
      let ingredientsMatch = true; // Default match
      if (normalizedShoppingList.length > 0) { // Only apply if shopping list filter IS active
          if (!item.ingrediencie || item.ingrediencie.trim() === '') {
              ingredientsMatch = false; // Recipe has no ingredients listed
          } else {
              const recipeIngredientsRaw = item.ingrediencie.split(',');
              const requiredIngredientNamesNormalized = recipeIngredientsRaw
                  .map(ing => cleanRecipeIngredient(ing)) // Clean e.g., " 100 ks mlieko " -> "mlieko"
                  .map(name => normalizeString(name))     // Normalize e.g., "mlieko" -> "mlieko", "šunka" -> "sunka"
                  .filter(name => name !== '');           // Remove any empty strings resulting from cleaning

              if (requiredIngredientNamesNormalized.length === 0) {
                  ingredientsMatch = false; // No valid ingredients after cleaning
              } else {
                  // Check if EVERY normalized required ingredient name...
                  ingredientsMatch = requiredIngredientNamesNormalized.every(normRequiredName => {
                      // ...is contained within AT LEAST ONE normalized shopping list item name.
                      return normalizedShoppingList.some(normAvailableName =>
                          normAvailableName.includes(normRequiredName)
                      );
                  });
              }
          }
      }


      // --- Final Decision: Combine all filter results ---
      return (
        searchBarMatches && difficultyMatches && veganskeMatches && vegetarianskeMatches && bezlepkoveMatches &&
        salatyMatches && polievkyMatches && natierkyMatches && obedyMatches &&
        ranajkyMatches && vecereMatches && cukorMatches && bielkovinyMatches &&
        sacharidyMatches &&
        kalorieMatches && // Use F logic
        tukMatches &&
        proteinovyPrasokMatches && // Use G snippet logic
        do5SurovinMatches && // Use G snippet logic (refined)
        timeMatches && // Use H snippet logic (refined)
        ingredientsMatch // Use I logic
      );
    }); // End items.filter
  } // End transform
} // End class