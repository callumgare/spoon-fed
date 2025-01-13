import { createGlobalState, useLocalStorage } from "@vueuse/core";

export const useShoppingListStore = createGlobalState(() =>
	useLocalStorage<Record<string, boolean>>("ingredientsSelection", {}),
);
