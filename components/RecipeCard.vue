<script setup lang="ts">
import type { Recipe } from "~/lib/paprika/types";

const props = defineProps<{
	recipe: Recipe | null;
}>();

const model = defineModel<boolean>();
const imageSrcFallback = "/images/fork.svg";
const imageSrc = ref(props.recipe?.image_url || imageSrcFallback);
watch(
	() => props.recipe?.image_url,
	() => {
		if (props.recipe?.image_url) {
			imageSrc.value = props.recipe.image_url;
		}
	},
);
</script>

<template>
  <Card
    v-if="recipe"
    @click="model = !model"
    :class="{selected: model}"
  >
    <template #header>
      <img
        alt=""
        :src="imageSrc"
        :class="{fallback: imageSrc === imageSrcFallback}"
        @error="imageSrc = imageSrcFallback"
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