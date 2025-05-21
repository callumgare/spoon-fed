<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core";
import RecipeResultsControls from "~/components/RecipeResultsControls.vue";

const { recipes, status, total } = useRecipes();
const settings = useSettingsStore();

onMounted(async () => {
	if (!settings.value.auth) {
		await navigateTo("/login");
	}
});

const { results } = useRecipeResults();

const currentTab = useLocalStorage<"recipes" | "shoppingList">("currentTab", "recipes")

function handleLogout() {
	settings.value.auth = "";
	settings.value.email = "";
	navigateTo("/");
}
</script>

<template>
	<div class="AppPage">
		<nav class="site">
			<SiteLogo size="small" />
			<RecipesLoadingBar
				v-if="status === 'pending' && total"
				:loaded="recipes.length"
				:total="total || 100"
			/>
			<div class="options">
				<Button label="Logout" icon="pi pi-sign-out" severity="secondary" @click="handleLogout"/>
			</div>
		</nav>
		<Tabs v-model:value="currentTab" class="tabs">
			<TabList>
				<Tab value="recipes">Recipes</Tab>
				<Tab value="shoppingList">Shopping List</Tab>
			</TabList>
			<TabPanels>
				<TabPanel value="recipes">
					<RecipeResultsControls />
					<div v-for="recipeGroup in results" :class="{noGroup: !recipeGroup.groupedValue}">
						<h3 v-if="results.length !== 1 || recipeGroup.groupedValue">
							{{ recipeGroup.groupedValue || "No Group" }}
						</h3>
						<RecipesSelector :recipes="recipeGroup.recipes" />
					</div>
				</TabPanel>
				<TabPanel value="shoppingList">
					<ShoppingList />
				</TabPanel>
			</TabPanels>
		</Tabs>
	</div>
</template>

<style scoped>
.AppPage {
	--page-margin: 1rem;
	margin: var(--page-margin);

	nav.site {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;
		padding: clamp(0rem, calc(1vw), 2rem);
		padding-bottom: 0;

		.RecipesLoadingBar {
			flex: 1 1 auto;
		}
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
			margin: 0 calc(var(--page-margin) * -1) 0; /* override body margin */

			.options {
				display: flex;
				flex-wrap: wrap;
				gap: 1rem;
			}
		}

		:deep(.p-tab) {
			font-size: 1.3rem;
		}

		:deep(.p-tabpanel) {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 1rem;
		}

		h3 {
			text-align: center;
  		font-size: 2rem;
		}

		.noGroup {
			h3 {
				color: var(--p-text-muted-color);
			}
		}
	}
	@media (min-width: 499px) {
		nav.site {
			justify-content: center;
		}
		.tabs {
			.p-tablist {
				background: var(--page-background);
				background-size: 100vw var(--page-height);
			}
		}
	}
	@media (max-width: 500px) {
		nav.site {
			justify-content: center;
		}
		.tabs {
			.p-tablist {
				position: fixed;
				order: 2;
				top: initial;
				bottom: 0;
				--p-tabs-tablist-background: var(--p-content-background) !important;
				width: 100%;

				.p-tab {
					padding-bottom: 1.5rem;
				}
			}
			.p-tabpanels {
				margin-bottom: 3em;
				padding: 0;
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