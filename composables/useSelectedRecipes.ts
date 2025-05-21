export const useSelectedRecipes = () => {
	const { recipes } = useRecipes();
	const recipesSelectionQty = useRecipesSelectionQtyStore();

	watch(recipesSelectionQty, () => {
		// TODO: unselect shopping list item if it's currently selected and the selected recipe qty which an ingredient comes from, has increased
	});

	const selectedRecipes = computed(() =>
		recipes.value
			.filter((recipe) => recipesSelectionQty.value[recipe.uid])
			.sort((a, b) => a.name.localeCompare(b.name))
	);

	const totalSelectedRecipes = computed(
		() => Object.values(recipesSelectionQty.value)
			.filter(qty => qty)
			.length
	)

	const totalStillLoadingSelectedRecipes = computed(
		() => totalSelectedRecipes.value - selectedRecipes.value.length
	)

	return {
		selectedRecipes,
		totalSelectedRecipes,
		totalStillLoadingSelectedRecipes
	}
};