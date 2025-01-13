import { createGlobalState, useLocalStorage } from "@vueuse/core";

export const useRecipesSelectionQtyStore = createGlobalState(() =>
	useLocalStorage<Record<string, number>>("recipesSelectionQty", {}),
);
