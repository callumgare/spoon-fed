<script setup lang="ts">
const props = defineProps<{
	item: ShoppingListItem;
}>();
</script>

<template>
  <div :class="['ShoppingListItem', {selected: item.checked.value}]" @click="item.toggleChecked">
    <Checkbox binary size="large" :v-model="item.checked" @click.stop="" />
    <ul>
      <li v-for="ingredient of item.ingredients">
        <span class="prefix">{{ ingredient.description.prefix }}</span>
        <span class="core">{{ ingredient.description.coreItem }}</span>
        <span class="suffix">{{ ingredient.description.suffix }}</span>
        <span class="source"> (from {{ ingredient.recipe.name }})</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.ShoppingListItem {
  display: flex;
  padding: 1em;
  gap: 1em;

  .core {
    font-weight: bold;
  }
  .source {
    opacity: 0.5;
  }

  @media (prefers-color-scheme: light) {
    --p-checkbox-checked-background: var(--p-surface-0);
    --p-checkbox-checked-border-color: var(--p-surface-300);
    .p-checkbox-checked :deep(.p-checkbox-icon) {
      color: var(--p-surface-700);
    }
  }
  @media (prefers-color-scheme: dark) {
    --p-checkbox-checked-background: var(--p-surface-950);
    --p-checkbox-checked-border-color: var(--p-surface-600);
    .p-checkbox-checked :deep(.p-checkbox-icon) {
      color: var(--p-surface-100);
    }
  }

  ul {
    padding-left: 0;
    li {
      list-style-type: none;
      font-size: 1.2em;
    }
  }

  &.selected {
    opacity: 0.5;
  }
}
</style>