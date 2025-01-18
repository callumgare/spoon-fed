import { createGlobalState } from "@vueuse/core";
import { Paprika } from "~/lib/paprika/client";
import type { Category } from "~/lib/paprika/types";

export const useCategories = createGlobalState(() => {
	const settings = useSettingsStore();

	const paprika = new Paprika({
		...settings.value,
		rootUrl: "/api/paprika",
		rateLimit: 1000 * 1, // Rate limit to 1 per second
	});

	const categories = ref<Category[]>([]);
	async function refreshCategories() {
		categories.value = await paprika.categories();
	}

	function getCategoryById(id: string): Category | null {
		return categories.value.find((category) => category.uid === id) ?? null;
	}

	return {
		categories,
		refreshCategories,
		getCategoryById,
	};
});
