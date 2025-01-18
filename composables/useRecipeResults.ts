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

type GroupBy = "difficulty";

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
	const groupBy = useLocalStorage<GroupBy | null>("groupBy", null, {
		initOnMounted: true,
	});
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
		const groupedRecipes: RecipeGroup[] = Object.entries(
			Object.groupBy(filteredRecipes, (recipe) =>
				groupBy.value ? recipe[groupBy.value] : "",
			),
		)
			.map(([groupedValue, recipes]) => ({
				groupedValue,
				recipes: recipes ?? [],
			}))
			.toSorted((a, b) =>
				groupBy.value
					? recipePropSortCompare(a.groupedValue, b.groupedValue, groupBy.value)
					: 0,
			);
		return groupedRecipes;
	});
	return {
		filters,
		results,
		groupBy,
	};
});

function recipePropSortCompare(a: unknown, b: unknown, groupBy: GroupBy) {
	if (groupBy === "difficulty") {
		if (typeof a !== "string" || typeof b !== "string") {
			throw new Error(
				`Grouping by ${groupBy} but value for one or both compared elements is not a string`,
			);
		}
		const difficultySortOrder = ["easy", "medium", "hard"];
		const getSortValue = (value: string) =>
			difficultySortOrder.indexOf(value.toLocaleLowerCase()) !== -1
				? difficultySortOrder.indexOf(value.toLocaleLowerCase())
				: difficultySortOrder.length;
		return getSortValue(a) - getSortValue(b);
	}
	groupBy satisfies never;
	throw new Error(`Unrecognised groupBy value: ${groupBy}`);
}
