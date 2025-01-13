import { createGlobalState } from "@vueuse/core";
import { parse } from "recipe-ingredient-parser-v3";
import type { Recipe } from "~/lib/paprika/types";

export type ShoppingListItem = {
	key: string;
	checked: boolean;
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
	setChecked: (checked: boolean) => void;
};

export const useShoppingList = createGlobalState(() => {
	const shoppingListStore = useShoppingListStore();
	const { recipes } = useRecipes();
	const recipesSelectionQty = useRecipesSelectionQtyStore();

	watch(recipesSelectionQty, () => {
		// TODO: unselect shopping list item if it's currently selected and the selected recipe qty which an ingredient comes from, has increased
	});

	const selectedRecipes = computed(() =>
		recipes.value.filter((recipe) => recipesSelectionQty.value[recipe.uid]),
	);

	const shoppingListItems = computed(() => {
		const shoppingListItemsMap: Record<string, ShoppingListItem> = {};
		for (const recipe of selectedRecipes.value) {
			const ingredients = recipe.ingredients.split("\n").filter(Boolean);
			for (const ingredient of ingredients) {
				const parsedIngredient = parse(ingredient, "eng");
				const shoppingListItemKey = parsedIngredient.ingredient;
				let shoppingListItem = shoppingListItemsMap[shoppingListItemKey];
				if (!shoppingListItem) {
					shoppingListItem = {
						key: shoppingListItemKey,
						checked: shoppingListStore.value[shoppingListItemKey],
						ingredients: [],
						toggleChecked: () => {
							shoppingListStore.value[shoppingListItemKey] =
								!shoppingListStore.value[shoppingListItemKey];
						},
						setChecked: (checked: boolean) => {
							shoppingListStore.value[shoppingListItemKey] = checked;
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
		for (const shoppingListItemKey in shoppingListStore) {
			if (
				!shoppingListItems.value.some(
					(item) => item.key === shoppingListItemKey,
				)
			) {
				delete shoppingListStore.value[shoppingListItemKey];
			}
		}
	});

	return {
		shoppingListItems,
	};
});
