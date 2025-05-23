import { createGlobalState, useLocalStorage } from "@vueuse/core";
import type { Category } from "~/lib/paprika/types";

export const useCategories = createGlobalState(() => {
	const paprika = usePaprika();

	let lastRefreshed: number | null = null

	const categories = useLocalStorage<Category[]>("categories", [], {
		initOnMounted: true,
	});
	async function refreshCategories() {
		if (lastRefreshed && lastRefreshed > (Date.now() - (1000 * 15))) {
			// If we previously refreshed in the last 15 seconds then don't bother refreshing again.
			// When a recipe is loaded that includes a reference to a category that's not in the global
			// list of categories the list of categories will be refreshed. However it's possible for 
			// a recipe to contain a reference to a category that no longer exists meaning that it
			// will always trigger a refresh even though the categories are already up to date. Limiting
			// refreshing to every 15 seconds will stop this occurring too frequently.

			return
		}
		if (paprika.value) {
			categories.value = await paprika.value.categories();
		} else {
			console.warn(
				"Attempted to refresh categories before paprika client has loaded.",
			);
		}
		lastRefreshed = Date.now()
	}

	function getCategoryById(id: string): Category | null {
		return categories.value.find((category) => category.uid === id) ?? null;
	}

	function createCategoriesTree<
		NodeWithoutChildren extends Record<string, unknown>,
		Node extends NodeWithoutChildren & { children: Node[] },
	>({
		fieldMapper,
	}: {
		fieldMapper: (category: Category) => NodeWithoutChildren;
	}): ComputedRef<Node[]> {
		return computed(() =>
			categories.value
				.filter((category) => category.parent_uid === null)
				// Weirdly macOS Paprika seems to sort top-level categories by name only
				// but sorts subcategories by order_flag then name
				.toSorted((a, b) => a.name.localeCompare(b.name))
				.map(
					(category) =>
						getCategoryTree({ fieldMapper, parent: category }) as Node,
				),
		);
	}

	function getCategoryTree<
		NodeWithoutChildren extends Record<string, unknown>,
		Node extends NodeWithoutChildren & { children: Node[] },
	>({
		fieldMapper,
		parent,
	}: {
		fieldMapper: (category: Category) => NodeWithoutChildren;
		parent: Category;
	}): NodeWithoutChildren & { children: Node[] } {
		return {
			...fieldMapper(parent),
			children: categories.value
				.filter((category) => category.parent_uid === parent.uid)
				.toSorted(
					(a, b) => a.order_flag - b.order_flag || a.name.localeCompare(b.name),
				)
				.map(
					(category) =>
						getCategoryTree({ fieldMapper, parent: category }) as Node,
				),
		};
	}

	function includeSubcategories(categoriesToMatch: Category[]) {
		const matchingCategories: Category[] = [...categoriesToMatch];
		for (const category of categoriesToMatch) {
			const children = categories.value.filter(
				(possibleChildCategory) =>
					possibleChildCategory.parent_uid === category.uid,
			);
			matchingCategories.push(...includeSubcategories(children));
		}
		return matchingCategories;
	}

	return {
		categories,
		refreshCategories,
		getCategoryById,
		createCategoriesTree,
		includeSubcategories,
	};
});
