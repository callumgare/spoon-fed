import { createGlobalState } from "@vueuse/core";
import { Cache } from "~/lib/cache/client";
import { Paprika } from "~/lib/paprika/client";
import type { Recipe, RecipeIndexItem } from "~/lib/paprika/types";
import { RateLimiter } from "~/lib/utils/flow";
import type { AsyncDataRequestStatus } from "#app";

export const useRecipes = createGlobalState(() => {
	const settings = useSettingsStore();

	const cache = new Cache();

	const paprika = new Paprika({ ...settings.value, rootUrl: "/api/paprika" });

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
		if (recipesIndex.data.value) {
			try {
				const rateLimiter = new RateLimiter(1000 * 1); // Rate limit to 1 per second
				for await (const recipeIndex of recipesIndex.data.value) {
					const cacheKey = `recipe:${recipeIndex.uid}:${recipeIndex.hash}`;
					const recipe = await cache.memo(cacheKey, async () => {
						await rateLimiter.waitTillReadyForNext();
						return await paprika.recipe(recipeIndex.uid, {
							hash: recipeIndex.hash,
						});
					});
					recipes.value.push(recipe);
				}
				status.value = "success";
			} catch (error) {
				console.error(error);
				status.value = "error";
			}
		}
	});

	return {
		recipes,
		recipesWithLoading,
		status,
		error,
		total,
	};
});
