import { createGlobalState, useLocalStorage } from "@vueuse/core";
import type { Recipe } from "~/lib/paprika/types";

export type Filter = {
	field: "categories";
	operator: "includes some";
	value: string[];
};

export type RecipeGroup = {
	groupedValue: unknown;
	recipes: Recipe[];
};

export const useRecipeResults = createGlobalState(() => {
	const filters = useLocalStorage<Filter[]>(
		"filters",
		[
			{
				field: "categories",
				operator: "includes some",
				value: [],
			},
		],
		{
			initOnMounted: true,
		},
	);
	const { recipes } = useRecipes();
	const { includeSubcategories, getCategoryById } = useCategories();
	const results = computed(() => {
		const filteredRecipes = recipes.value.filter((recipe) => {
			return filters.value.every((filter) => {
				if (filter.operator === "includes some") {
					if (filter.field === "categories") {
						if (filter.value.length === 0) {
							return true;
						}
						const allCategoriesToMatch = includeSubcategories(
							filter.value
								.map((catId) => getCategoryById(catId))
								.filter((cat) => cat !== null),
						);
						return recipe.categories.some((catId) =>
							allCategoriesToMatch.some((cat) => cat.uid === catId),
						);
					}
					filter.field satisfies never;
					console.error(`Unknown filter field: ${filter.field}`);
				} else {
					filter.operator satisfies never;
					console.error(`Unknown filter operator: ${filter.operator}`);
				}
			});
		});
		return {
			groupedValue: undefined,
			recipes: filteredRecipes,
		} satisfies RecipeGroup;
	});
	return {
		filters,
		results,
	};
});
