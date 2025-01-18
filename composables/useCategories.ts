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
