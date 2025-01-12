<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core";

const { recipes, recipesWithLoading, status, total } = useRecipes();
const settings = useSettings();

const selectedRecipeIds = useLocalStorage<Record<string, boolean>>(
	"selectedRecipeIds",
	{},
);

const selectedRecipes = computed(
	() =>
		recipes.value?.filter((recipe) => selectedRecipeIds.value[recipe.uid]) ||
		[],
);
const ingredientsForSelected = computed(() =>
	selectedRecipes.value.flatMap((recipe) => recipe.ingredients.split("\n")),
);
function handleLogout() {
	settings.value.auth = "";
	settings.value.email = "";
}
</script>

<template>
	<h1>Spoon Fed</h1>
	<RecipesLoadingBar
		v-if="status === 'pending' && total"
		:loaded="recipes.length"
		:total="total"
	/>
	<Tabs value="recipes" class="tabs">
		<nav>
			<TabList>
				<Tab value="recipes">Recipes</Tab>
				<Tab value="ingredients">Ingredients</Tab>
			</TabList>
			<div class="options">
				<Button label="Logout" icon="pi pi-sign-out" severity="secondary" @click="handleLogout"/>
			</div>
		</nav>
		<TabPanels>
			<TabPanel value="recipes">
				<RecipesSelector :recipes="recipesWithLoading || []" v-model="selectedRecipeIds" />
			</TabPanel>
			<TabPanel value="ingredients">
				<IngredientsList :ingredients="ingredientsForSelected" />
			</TabPanel>
		</TabPanels>
	</Tabs>
</template>

<style scoped>
.tabs {
	nav {
		position: sticky;
  	top: 0;
		align-items: center;
  	justify-content: space-between;
		display: flex;
  	flex-wrap: wrap;
		background: var(--p-tabs-tablist-background);
		z-index: 1;

		.options {
			display: flex;
			flex-wrap: wrap;
			gap: 1rem;
		}
	}

	@media (max-width: 500px) {
		nav {
			order: 2;
			top: initial;
			bottom: 0;
		}
	}
}
</style>