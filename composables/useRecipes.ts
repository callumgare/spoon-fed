import { createGlobalState } from "@vueuse/core";
import type { Recipe, RecipeIndexItem } from "~/lib/paprika/types";
import type { AsyncDataRequestStatus } from "#app";

export const useRecipes = createGlobalState(() => {
	const paprika = usePaprika();

	const recipesIndex = useAsyncData(
		"recipes",
		() =>
			paprika.value?.recipes({ cacheTtl: 10 * 1000 }) ||
			Promise.resolve([] as RecipeIndexItem[]),
		{
			server: false,
			watch: [paprika],
		},
	);

	const status = ref<AsyncDataRequestStatus>(recipesIndex.status.value);
	watch(recipesIndex.status, () => {
		if (recipesIndex.status.value !== "success") {
			status.value = recipesIndex.status.value;
		}
	});

	const error = ref<null | Error>(recipesIndex.error.value);
	watch(recipesIndex.error, () => {
		error.value = recipesIndex.error.value;
	});

	const total = ref<number | undefined>(recipesIndex.data.value?.length);
	watch(recipesIndex.data, () => {
		total.value = recipesIndex.data.value?.length;
	});

	const { refreshCategories, getCategoryById } = useCategories();

	const recipes = ref<Recipe[]>([]);
	const recipesWithLoading = computed((): (Recipe | null)[] => {
		const numberOfLoadingRecipesToInclude = total.value || recipesIndex.status.value !== 'pending' ? (total.value || 0) - recipes.value.length : 3
		return [
			...recipes.value,
			...new Array(numberOfLoadingRecipesToInclude).fill(
				null,
			),
		]
	});

	function getRecipe(recipeId: string) {
		return recipes.value.find(recipe => recipe.uid === recipeId)
	}

	watch(recipesIndex.data, async () => {
		// If we have a lot of recipes already in cache then we're going to add them to "recipes" at a very high rate
		// which will cause any computed refs and watches to do a bunch of calculation that will just be immediately
		// replaced. Instead we queue up new recipes and load every half a second.
		let recipeQueue: Recipe[] = [];
		const processRecipeQueue = () => {
			if (!recipeQueue.length) {
				return;
			}
			recipes.value.push(...recipeQueue);
			recipeQueue = [];
		};
		const intervalId = setInterval(processRecipeQueue, 500);
		if (recipesIndex.data.value) {
			try {
				for await (const recipeIndex of recipesIndex.data.value) {
					if (!paprika.value) {
						break;
					}
					// if (recipes.value.length > 3) {
					// 	break;
					// }
					const recipe = await paprika.value.recipe(recipeIndex.uid, {
						hash: recipeIndex.hash,
						cacheTtl: undefined, // We cache forever since a hash change will break the cache
					});
					for (const categoryId of recipe.categories) {
						if (!getCategoryById(categoryId)) {
							await refreshCategories();
							if (!getCategoryById(categoryId)) {
								logger.warn(`The recipe "${recipe.name}" (${recipe.uid}) includes an ID for a category that does not exist (${categoryId})`)
							}
						}
					}
					recipeQueue.push(recipe);
				}
				status.value = "success";
			} catch (error) {
				console.error(error);
				status.value = "error";
			}
		}
		clearInterval(intervalId);
		processRecipeQueue();
	});

	return {
		recipes,
		recipesWithLoading,
		getRecipe,
		status,
		error,
		total,
	};
});
