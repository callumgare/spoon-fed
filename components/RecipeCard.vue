<script setup lang="ts">
import type { Recipe } from "~/lib/paprika/types";

const { recipe, type = "upright", selectionMethod = "whole-card" } = defineProps<{
	recipe: Recipe | null;
  type?: "upright" | "title"
  selectionMethod?: "whole-card" | "icon"
}>()

const recipeId = computed(() => recipe?.uid || "");
const selectionQty = useRecipeSelectionQty(recipeId);
const imageSrcFallback = "/images/fork.svg";
const pictureUrls = computed(() => [
	...(recipe?.photo_url ? [recipe?.photo_url] : []),
	...(recipe?.image_url ? [recipe?.image_url] : []),
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

const slots = useSlots()
const hasContentSection = slots.additionalContent || selectionMethod === "icon"
</script>

<template>
  <component
    :is="selectionMethod === 'whole-card' ? 'button' : 'div'"
    @click="() => {if (selectionMethod === 'whole-card') { selectionQty = selectionQty ? 0 : 1 }}"
    :class="[
      'RecipeCard',
      {
        selected: selectionQty,
        hasContentSection,
      },
      `selection-method-${selectionMethod}`,
      `type-${type}`
    ]"
  >
    <Card
      v-if="recipe"
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
      <template #content>
        <div v-if="selectionMethod === 'icon'" class="controls">
          <button v-if="selectionQty" @click="selectionQty = 0">
            <span class="pi pi-times-circle"></span>
          </button>
        </div>
        <slot name="additionalContent" />
      </template>
    </Card>
    <Card v-else :class="[{selected: selectionQty}, `type-${type}`]">
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
  </component>
</template>

<style scoped>
.RecipeCard {
  &, button {
    /* remove styles set by browser */
    background: none;
    border: none;
    padding: 0;
    display: block;
    color: inherit;
  }

  --selected-color: var(--p-yellow-500);
  
  &.selected .p-card {
    outline: var(--selected-color) 0.2rem solid;
  }
  
  
  &.selection-method-whole-card {
    &:hover {
      --selected-color: var(--p-yellow-400);
    }
    &:not(.selected):hover .p-card {
      outline: var(--selected-color) 0.1rem solid;
    }
  
    &.selected .p-card {
      color: var(--p-surface-800);
    }
  }

  &.type-upright {
    &.selected {
      .p-card {
        background-color: var(--selected-color);
      }
    }
  }
  
  &.type-title {
    .p-card {
      flex-direction: row;
      width: auto;
      align-items: center;
  
      .p-card-header, .p-skeleton {
        max-height: 5rem;
  
        img {
          height: 100%;
          object-fit: cover;
          max-height: 5rem;
  
          &.fallback {
            padding: 0.5rem;
            background-color: var(--p-card-background);
          }
        }
      }
    }
  }

  .p-card {
    width: min(15rem, 40vw);
    overflow: hidden;
  
    img, .p-skeleton {
      width: 100%;
      display: block;
  
      &.fallback {
        padding: 2em;
        background: var(--p-card-background);
      }
    }
    .p-skeleton {
      height: 5rem;
    }

    .p-card-content {
      .controls {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        align-items: center;
        color: var(--p-text-color);

        button {
          padding: 0.5rem;
        }

        .pi {
          font-size: 1.4rem;
        }
      }
    }
  }
}
/* We don't use nesting here since nesting the deep selector is currently broken https://github.com/vuejs/core/issues/13159 */
.p-card :deep(.p-card-body) {
  flex: 1;
}
.RecipeCard:not(.hasContentSection) .p-card :deep(.p-card-content) {
  display: none;
}
.RecipeCard .p-card :deep(.p-card-content) {
  display: flex;
  gap: 0.5rem
}
.RecipeCard.type-title .p-card :deep(.p-card-header) {
  width: 5rem;
}
.RecipeCard.type-title :deep(.p-card-body) {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}
</style>