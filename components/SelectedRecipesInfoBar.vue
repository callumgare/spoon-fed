<script setup lang="ts">
const { onlyShowFilteredOut } = defineProps<{
	onlyShowFilteredOut?: boolean;
}>()
	const {
    selectedRecipes,
    totalSelectedRecipes,
    totalStillLoadingSelectedRecipes
  } = useSelectedRecipes({onlyFilteredOut: onlyShowFilteredOut})
  const title = computed(() => {
    if (onlyShowFilteredOut) {
      const totalFilteredOutSelectedRecipes = selectedRecipes.value.length
      return `${totalFilteredOutSelectedRecipes} selected recipe${totalSelectedRecipes.value !== 1 ? 's' : ''} excluded by the current filter`
    }
    return `${totalSelectedRecipes.value} recipe${totalSelectedRecipes.value !== 1 ? 's' : ''} selected${totalStillLoadingSelectedRecipes.value ? ' (some recipe details still loading)' : ''}`
  })
</script>

<template>
	<Panel :header="title" toggleable :collapsed="true" class="SelectedRecipesInfoBar">
    <ul>
      <li v-for="selectedRecipe in selectedRecipes" :key="selectedRecipe.uid">
        <RecipeCard :recipe="selectedRecipe" type="title" selection-method="icon">
        </RecipeCard>
      </li>
      <li v-if="totalStillLoadingSelectedRecipes && !onlyShowFilteredOut" class="status">
        {{totalStillLoadingSelectedRecipes}} recipe{{totalStillLoadingSelectedRecipes !== 1 ? 's' : ''}} still loading
      </li>
    </ul>
    <Message v-if="!onlyShowFilteredOut" severity="secondary">
      By the way - you can view your list of selected recipes in Paprika directly. Open and sync Paprika, then in the left-hand sidebar select "Menus" and open  "Spoon Fed - Selected Recipes".
    </Message>
  </Panel>
</template>

<style scoped>
.SelectedRecipesInfoBar {
  ul {
    list-style-type: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 0.2rem;
  
    li {
      .RecipeCard {
        width: 100%;
      }
      &.status {
        text-align: center;
        margin: 0.5rem;
        font-size: 1.2rem;
      }
    }
  }
}

/* We don't use nesting here since nesting the deep selector is currently broken https://github.com/vuejs/core/issues/13159 */
.SelectedRecipesInfoBar :deep(.p-panel-content) {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>