<script setup lang="ts">
const props = defineProps<{
	loaded: number;
	total: number;
}>();
</script>

<template>
	<div class="RecipesLoadingBar">
    <span>Syncing recipes: {{loaded}} / {{total}}</span>
    <ProgressBar
      :value="(loaded / total) * 100"
      :show-value="false"
    ></ProgressBar>
  </div>
</template>

<style scoped>
.RecipesLoadingBar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  .p-progressbar {
    flex: 0 1 20rem;
  }
}
</style>