<script setup lang="ts">
const { recipes, recipesWithLoading, status, total } = useRecipes();
const settings = useSettingsStore();

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
				<Tab value="shoppingList">Shopping List</Tab>
			</TabList>
			<div class="options">
				<Button label="Logout" icon="pi pi-sign-out" severity="secondary" @click="handleLogout"/>
			</div>
		</nav>
		<TabPanels>
			<TabPanel value="recipes">
				<RecipesSelector :recipes="recipesWithLoading" />
			</TabPanel>
			<TabPanel value="shoppingList">
				<ShoppingList />
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