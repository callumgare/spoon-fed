<script setup lang="ts">
const { recipes, recipesWithLoading, status, total } = useRecipes();
const settings = useSettingsStore();

function handleLogout() {
	settings.value.auth = "";
	settings.value.email = "";
}
</script>

<template>
	<div class="MainView" key="MainView">
		<nav class="site">
			<SiteLogo size="small" />
			<div class="options">
				<Button label="Logout" icon="pi pi-sign-out" severity="secondary" @click="handleLogout"/>
			</div>
		</nav>
		<RecipesLoadingBar
			v-if="status === 'pending' && total"
			:loaded="recipes.length"
			:total="total"
		/>
		<Tabs value="recipes" class="tabs">
			<TabList>
				<Tab value="recipes">Recipes</Tab>
				<Tab value="shoppingList">Shopping List</Tab>
			</TabList>
			<TabPanels>
				<TabPanel value="recipes">
					<RecipesSelector :recipes="recipesWithLoading" />
				</TabPanel>
				<TabPanel value="shoppingList">
					<ShoppingList />
				</TabPanel>
			</TabPanels>
		</Tabs>
	</div>
</template>

<style scoped>
.MainView {
	nav.site {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;
		padding: clamp(0rem, calc(1vw), 2rem);
		padding-bottom: 0;
	}
	.tabs {
		:deep(.p-tablist-content) {
			border-style: solid;
			border-color: var(--p-tabs-tablist-border-color);
			border-width: var(--p-tabs-tablist-border-width);
		}
		:deep(.p-tablist-tab-list) {
			margin: auto;
			width: fit-content;
			margin-bottom: -1px;
		}
		.p-tablist {
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
		
	}
	@media (max-width: 500px) {
		nav.site {
			justify-content: center;
		}
		.tabs {
			.p-tablist {
				order: 2;
				top: initial;
				bottom: 0;
			}

			:deep(.p-tablist-tab-list) {
				margin-bottom: 0;
			}

			:deep(.p-tablist-content) {
				border-width: 1px 0 0 0;
			}
		}
	}
}
</style>