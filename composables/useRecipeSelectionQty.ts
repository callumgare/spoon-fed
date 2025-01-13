export const useRecipeSelectionQty = (recipeId: Ref<string>) => {
	const recipesSelectionQty = useRecipesSelectionQtyStore();
	return computed({
		get() {
			return recipesSelectionQty.value[recipeId.value] || 0;
		},
		set(newValue) {
			recipesSelectionQty.value[recipeId.value] = newValue;
		},
	});
};
