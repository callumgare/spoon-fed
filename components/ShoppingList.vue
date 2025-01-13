<script setup lang="ts">
const { shoppingListItems } = useShoppingList();
</script>

<template>
  <ul>
    <li v-for="shoppingListItem in shoppingListItems">
      <ShoppingListItem :item="shoppingListItem" />
    </li>
  </ul>
</template>

<style scoped>
ul {
  padding-left: 0;
  li {
    list-style-type: none;
  }
}
</style>