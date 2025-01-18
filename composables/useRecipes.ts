import { createGlobalState } from "@vueuse/core";
import { Paprika } from "~/lib/paprika/client";
import type { Recipe } from "~/lib/paprika/types";
import type { AsyncDataRequestStatus } from "#app";

export const useRecipes = createGlobalState(() => {
	const settings = useSettingsStore();

	const paprika = new Paprika({
		...settings.value,
		rootUrl: "/api/paprika",
		rateLimit: 1000 * 1, // Rate limit to 1 per second
	});

	const recipesIndex = useAsyncData("recipes", () => paprika.recipes(), {
		server: false,
	});

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

	const recipes = ref<Recipe[]>([]);
	const recipesWithLoading = computed((): (Recipe | null)[] => [
		...recipes.value,
		...new Array(total.value ? total.value - recipes.value.length : 0).fill(
			null,
		),
	]);
	watch(recipesIndex.data, async () => {
		// If we have a lot of recipes already in cache then we're going to add them to "recipes" at a very high rate
		// which will cause any computed refs and watches to do a bunch of calculation that will just be immediately 
		// replaced. Instead we queue up new recipes and load every half a second.
		let recipeQueue: Recipe[] = []
		const processRecipeQueue = () => {
			if (!recipeQueue.length) {
				return
			}
			recipes.value.push(...recipeQueue)
			recipeQueue = []
		}
		const intervalId = setInterval(processRecipeQueue, 500)
		if (recipesIndex.data.value) {
			try {
				for await (const recipeIndex of recipesIndex.data.value) {
					const recipe = await paprika.recipe(recipeIndex.uid, recipeIndex.hash);
					recipeQueue.push(recipe);
				}
				status.value = "success";
			} catch (error) {
				console.error(error);
				status.value = "error";
			}
		}
		clearInterval(intervalId)
		processRecipeQueue()
	});

	return {
		recipes,
		recipesWithLoading,
		status,
		error,
		total,
	};
});
