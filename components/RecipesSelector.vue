<script setup lang="ts">
import type { Recipe } from "~/lib/paprika/types";
import RecipeCard from "./RecipeCard.vue";

const props = defineProps<{
	recipes: (Recipe | null)[];
}>();

const selectedRecipes = defineModel<Record<string, boolean>>({ default: {} });
</script>

<template>
  <ul>
    <li v-for="recipe in recipes">
      <RecipeCard :recipe="recipe" v-model="selectedRecipes[recipe?.uid || '']" />
    </li>
  </ul>
</template>

<style scoped>
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    gap: 2rem;
    justify-content: center;

    li {
      list-style-type: none;
    }
  }
</style>