<script setup lang="ts">
const props = defineProps<{
	loaded: number;
	total: number;
}>();
</script>

<template>
	<div class="RecipesLoadingBar">
    <span>
      <strong>Syncing recipes: </strong>
      {{loaded}} / {{total}}
    </span>
    <ProgressBar
      :value="(loaded / total) * 100"
      :show-value="false"
    >
    </ProgressBar>
  </div>
</template>

<style scoped>
.RecipesLoadingBar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  justify-content: center;

  .p-progressbar {
    flex: 0 1 20rem;
  }
}
:deep(.p-progressbar-determinate .p-progressbar-value) {
  justify-content: safe center;
  overflow: visible;
}
:deep(.p-progressbar-label) {
  min-width: max-content;
}
</style>