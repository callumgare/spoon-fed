<script setup lang="ts">
import { useCycleList } from "@vueuse/core";
import type { Recipe } from "~/lib/paprika/types";

const props = defineProps<{
	recipe: Recipe | null;
}>();

const recipeId = computed(() => props.recipe?.uid || "");
const selectionQty = useRecipeSelectionQty(recipeId);
const imageSrcFallback = "/images/fork.svg";
const listOfImageSrcs = computed(() => [
	...(props.recipe?.photo_url ? [props.recipe?.photo_url] : []),
	...(props.recipe?.image_url ? [props.recipe?.image_url] : []),
	imageSrcFallback,
]);

const { state: imageSrc, next, go } = useCycleList(listOfImageSrcs);
watch(listOfImageSrcs, () => go(0));
</script>

<template>
  <Card
    v-if="recipe"
    @click="selectionQty = selectionQty ? 0 : 1"
    :class="{selected: selectionQty}"
  >
    <template #header>
      <img
        alt=""
        :src="imageSrc"
        :class="{fallback: imageSrc === imageSrcFallback}"
        @error="next()"
      />
    </template>
    <template #title>
      {{recipe.name}}
    </template>
    <template #content v-if="recipe?.description">
      <p class="m-0">
        {{ recipe.description }}
      </p>
    </template>
  </Card>
  <Card v-else>
    <template #header>
      <Skeleton height="150px"></Skeleton>
    </template>
    <template #title>
      <Skeleton height="1.5rem"></Skeleton>
    </template>
    <template #content>
      <Skeleton></Skeleton>
    </template>
  </Card>
</template>

<style scoped>
.p-card {
  width: min(15rem, 40vw);
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

  img, .p-skeleton {
    width: 100%;

    &.fallback {
      padding: 2em;
    }
  }
  .p-skeleton {
    height: 5rem;
  }
  .p-card-header {
  }
}
</style>