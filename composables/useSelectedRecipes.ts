export const useSelectedRecipes = ({onlyFilteredOut}: {onlyFilteredOut?: boolean} = {}) => {
	const { recipes } = useRecipes();
  const { results } = useRecipeResults();
	const recipesSelectionQty = useRecipesSelectionQtyStore();

	watch(recipesSelectionQty, () => {
		// TODO: unselect shopping list item if it's currently selected and the selected recipe qty which an ingredient comes from, has increased
	});

	const selectedRecipes = computed(() => {
		const shownRecipes = onlyFilteredOut
			? recipes.value.filter(
				recipe => !(results.value.some(
					recipeGroup => recipeGroup.recipes.some(
						resultRecipe => resultRecipe && (resultRecipe.uid === recipe.uid)
					)
				))
			)
			: recipes.value

		return shownRecipes
			.filter((recipe) => recipesSelectionQty.value[recipe.uid])
			.sort((a, b) => a.name.localeCompare(b.name))
	});

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