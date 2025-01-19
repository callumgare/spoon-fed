<script setup lang="ts">
const { filters, groupBy } = useRecipeResults();
const { createCategoriesTree } = useCategories();

const tree = createCategoriesTree({
	fieldMapper: (category) => ({
		key: category.uid,
		label: category.name,
	}),
});

const categoryFilterSelectedModel = computed({
	get() {
		return Object.fromEntries(
			(
				filters.value.find((filter) => filter.field === "categories")?.value ||
				[]
			).map((catId) => [
				catId,
				{
					checked: true,
				},
			]),
		);
	},
	set(selectedNodes) {
		let selectedCategoryIds: string[] = [];
		if (selectedNodes) {
			selectedCategoryIds = Object.entries(selectedNodes)
				.filter((entry) => entry[1].checked)
				.map((entry) => entry[0]);
		}
		const categoryFilter = filters.value.find(
			(filter) => filter.field === "categories",
		);
		if (categoryFilter) {
			categoryFilter.value = selectedCategoryIds;
		}
	},
});
</script>

<template>
  <div class="RecipeResultsControls">
    <Fieldset legend="Filter">
      <FloatLabel variant="in">
        <TreeSelect
          v-model="categoryFilterSelectedModel"
          :options="tree"
          selectionMode="checkbox"
          inputId="categoryFilter"
          :showClear="Object.values(categoryFilterSelectedModel).some(cat => cat.checked)"
        />
        <label for="categoryFilter">Categories</label>
      </FloatLabel>
    </Fieldset>
    <Fieldset legend="Group By">
      <FloatLabel variant="in">
        <Select
          v-model="groupBy"
          :options="[{value: 'difficulty', label: 'Difficulty'}]"
          selectionMode="checkbox"
          inputId="recipeFieldGroupBy"
          showClear
          optionLabel="label"
          optionValue="value"
        />
        <label for="recipeFieldGroupBy">Recipe Field</label>
      </FloatLabel>
    </Fieldset>
  </div>
</template>

<style scoped>
.RecipeResultsControls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;

  .p-inputwrapper {
    min-width: 15rem;
  }

  /* Small hack to fix the issue of clear button overlapping with selected items text */
  :deep(.p-treeselect.p-inputwrapper-filled .p-treeselect-label) {
    padding-right: 1.7rem;
  }
}
</style>