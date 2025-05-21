import { createGlobalState, useLocalStorage } from "@vueuse/core";
import { parse } from "recipe-ingredient-parser-v3";
import type { Recipe } from "~/lib/paprika/types";

export type ShoppingListItem = {
	key: string;
	checkedSortKey: ComputedRef<number>;
	checked: WritableComputedRef<boolean, boolean>;
	ingredients: Array<{
		description: {
			full: string;
			prefix: string;
			coreItem: string;
			suffix: string;
		};
		multiplier: number;
		recipe: Recipe;
	}>;
	toggleChecked: () => void;
};

export const useShoppingList = createGlobalState(() => {
	const shoppingListItemsCheckedState = useLocalStorage<Record<string, number>>(
		"shoppingListItemsCheckedState",
		{},
	);
	const { status } = useRecipes();
	const recipesSelectionQty = useRecipesSelectionQtyStore();

	watch(recipesSelectionQty, () => {
		// TODO: unselect shopping list item if it's currently selected and the selected recipe qty which an ingredient comes from, has increased
	});

	const {selectedRecipes} = useSelectedRecipes()

	const shoppingListItems = computed(() => {
		const shoppingListItemsMap: Record<string, ShoppingListItem> = {};
		for (const recipe of selectedRecipes.value) {
			const ingredients = recipe.ingredients.split("\n").filter(Boolean);
			for (const ingredient of ingredients) {
				const parsedIngredient = parse(ingredient, "eng");
				const shoppingListItemKey = parsedIngredient.ingredient;
				let shoppingListItem = shoppingListItemsMap[shoppingListItemKey];
				const checked = computed({
					get() {
						return Boolean(
							shoppingListItemsCheckedState.value[shoppingListItemKey] &&
								shoppingListItemsCheckedState.value[shoppingListItemKey] !==
									Number.MAX_SAFE_INTEGER,
						);
					},
					set(newValue) {
						if (newValue) {
							shoppingListItemsCheckedState.value[shoppingListItemKey] =
								Date.now();
						} else {
							shoppingListItemsCheckedState.value[shoppingListItemKey] =
								Number.MAX_SAFE_INTEGER;
						}
					},
				});
				if (!shoppingListItem) {
					shoppingListItem = {
						key: shoppingListItemKey,
						checkedSortKey: computed(
							() =>
								shoppingListItemsCheckedState.value[shoppingListItemKey] ??
								Number.MAX_SAFE_INTEGER,
						),
						checked,
						ingredients: [],
						toggleChecked: () => {
							checked.value = !checked.value;
						},
					};
					shoppingListItemsMap[shoppingListItemKey] = shoppingListItem;
				}

				let ingredientPrefix: string;
				let ingredientCore: string;
				let ingredientSuffix: string;
				const coreIngredientIndex = ingredient
					.toLocaleLowerCase()
					.indexOf(parsedIngredient.ingredient.toLocaleLowerCase());
				if (coreIngredientIndex !== -1) {
					ingredientPrefix = ingredient.substring(0, coreIngredientIndex);
					ingredientCore = ingredient.substring(
						coreIngredientIndex,
						coreIngredientIndex + parsedIngredient.ingredient.length,
					);
					ingredientSuffix = ingredient.substring(
						coreIngredientIndex + parsedIngredient.ingredient.length,
					);
				} else {
					ingredientPrefix = "";
					ingredientCore = ingredient;
					ingredientSuffix = "";
				}

				shoppingListItem.ingredients.push({
					description: {
						full: ingredient,
						prefix: ingredientPrefix,
						coreItem: ingredientCore,
						suffix: ingredientSuffix,
					},
					multiplier: recipesSelectionQty.value[recipe.uid],
					recipe,
				});
			}
		}
		return Object.values(shoppingListItemsMap);
	});

	// Delete shoppingListItem checked state when it no longer appears on the shopping list due to the recipe(s) which it's ingredient(s) come from are unselected
	watch(shoppingListItems, () => {
		if (status.value === "success") {
			for (const shoppingListItemKey in shoppingListItemsCheckedState.value) {
				if (
					!shoppingListItems.value.some(
						(item) => item.key === shoppingListItemKey,
					)
				) {
					delete shoppingListItemsCheckedState.value[shoppingListItemKey];
				}
			}
		}
	});

	return {
		shoppingListItems,
	};
});
