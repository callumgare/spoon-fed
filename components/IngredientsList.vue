<script setup lang="ts">
const props = defineProps<{
	ingredients: string[];
}>();
</script>

<template>
	<ul>
		<li v-for="ingredient in ingredients">{{ ingredient }}</li>
	</ul>
</template>

<style scoped>
.p-card {
  width: 15rem;
  overflow: hidden;

  &.selected {
    --selected-color: var(--p-yellow-500);
    background-color: var(--selected-color);
    outline: var(--selected-color) 0.2rem solid;
    color: black;
  }
}
</style>