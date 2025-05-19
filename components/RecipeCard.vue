<script setup lang="ts">
import type { Recipe } from "~/lib/paprika/types";

const props = defineProps<{
	recipe: Recipe | null;
}>();

const recipeId = computed(() => props.recipe?.uid || "");
const selectionQty = useRecipeSelectionQty(recipeId);
const imageSrcFallback = "/images/fork.svg";
const pictureUrls = computed(() => [
	...(props.recipe?.photo_url ? [props.recipe?.photo_url] : []),
	...(props.recipe?.image_url ? [props.recipe?.image_url] : []),
]);

const paprika = usePaprika()

const imageSrc = ref()

watch(pictureUrls, async () => {
  const headers = paprika.value?.getHeaders()
  for (const imageUrl of pictureUrls.value) {
    try {
      const response = await fetch(imageUrl, {headers});

      if (!response.ok) {
        throw new Error(`Non-successful status code received when fetching picture: ${response.status}`);
      }

      const imageBlob = await response.blob();
      imageSrc.value = URL.createObjectURL(imageBlob)
    } catch(error) {
      logger.info(`The following error occurred when loading: ${imageUrl}`)
      logger.error(error)
      continue
    }
    return;
  }
  imageSrc.value = imageSrcFallback
}, { immediate: true });

</script>

<template>
  <Card
    v-if="recipe"
    @click="selectionQty = selectionQty ? 0 : 1"
    :class="{selected: selectionQty}"
  >
    <template #header>
      <img
        v-if="imageSrc"
        alt=""
        :src="imageSrc"
        :class="{fallback: imageSrc === imageSrcFallback}"
      />
      <Skeleton v-else height="min(15rem, 40vw)"></Skeleton>
    </template>
    <template #title>
      {{recipe.name}}
    </template>
  </Card>
  <Card v-else>
    <template #header>
      <Skeleton height="min(15rem, 40vw)"></Skeleton>
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
}
</style>