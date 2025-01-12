<script setup lang="ts">
import type { Recipe } from "~/lib/paprika/types";

const props = defineProps<{
	recipe: Recipe;
}>();

const model = defineModel<boolean>();
const imageSrcFallback = "/images/fork.svg";
const imageSrc = ref(props.recipe.image_url || imageSrcFallback);
</script>

<template>
  <Card
    @click="model = !model"
    :class="{selected: model}"
  >
    <template #header>
      <img
        alt=""
        :src="imageSrc"
        :class="{fallback: imageSrc === imageSrcFallback}"
        style="width: 100%"
        @error="imageSrc = imageSrcFallback"
      />
    </template>
    <template #title>{{recipe.name}}</template>
    <template #content v-if="recipe.description">
      <p class="m-0">
        {{ recipe.description }}
      </p>
    </template>
  </Card>
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

    img.fallback {
      filter: invert();
    }
  }

  img {
    width: 100%;

    &.fallback {
      padding: 2em;
    }
  }
}
</style>