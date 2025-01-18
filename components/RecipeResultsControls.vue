<script setup lang="ts">
const { filters } = useRecipeResults();
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
		const selectedCategoryIds = Object.entries(selectedNodes)
			.filter((entry) => entry[1].checked)
			.map((entry) => entry[0]);
		const categoryFilter = filters.value.find(
			(filter) => filter.field === "categories",
		);
		if (categoryFilter) {
			categoryFilter.value = selectedCategoryIds;
		}
	},
});

const selectedValue = ref(null);
</script>

<template>
  <Fieldset legend="Filters">
    <FloatLabel class="w-full md:w-80" variant="in">
      <TreeSelect
        v-model="categoryFilterSelectedModel"
        :options="tree"
        selectionMode="checkbox"
        placeholder="Select a category"
        inputId="categoryFilter"
      />
      <label for="categoryFilter">Categories</label>
    </FloatLabel>
  </Fieldset>
</template>

<style scoped>
</style>