<script setup lang="ts">
const { shoppingListItems } = useShoppingList();
</script>

<template>
  <TransitionGroup v-if="shoppingListItems.length" tag="ul" name="fade" class="ShoppingList">
    <li v-for="shoppingListItem in shoppingListItems.toSorted((a, b) => b.checkedSortKey.value - a.checkedSortKey.value)" :key="shoppingListItem.key">
      <ShoppingListItem :item="shoppingListItem" />
    </li>
  </TransitionGroup>
  <div v-else>
    No shopping list items. Please select some recipes to add ingredients to the shopping list.
  </div>
</template>

<style scoped>
.ShoppingList {
  padding-left: 0;
  li {
    list-style-type: none;
  }


  /* 1. declare transition */
  .fade-move,
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  }

  /* 2. declare enter from and leave to state */
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: scaleY(0.01) translate(30px, 0);
  }

  /* 3. ensure leaving items are taken out of layout flow so that moving
        animations can be calculated correctly. */
  .fade-leave-active {
    position: absolute;
  }
}
</style>