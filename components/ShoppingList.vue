<script setup lang="ts">
const { shoppingListItems } = useShoppingList();
</script>

<template>
  <div class="ShoppingList">
    <template v-if="shoppingListItems.length">
      <SelectedRecipesInfoBar />
      <TransitionGroup tag="ul" name="fade" class="ShoppingList">
        <li v-for="shoppingListItem in shoppingListItems.toSorted((a, b) => b.checkedSortKey.value - a.checkedSortKey.value)" :key="shoppingListItem.key">
          <ShoppingListItem :item="shoppingListItem" />
        </li>
      </TransitionGroup>
    </template>
    <template v-else>
      No shopping list items. Please select some recipes to add ingredients to your shopping list.
    </template>
  </div>
</template>

<style scoped>
.ShoppingList {
  margin-top: 1.5rem;
  ul {
    padding-left: 0;
    li {
      list-style-type: none;
      width: fit-content;
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
}
</style>