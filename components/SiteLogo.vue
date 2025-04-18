<script setup lang="ts">
const props = defineProps<{
	size?: "large" | "small";
}>();
</script>

<template>
  <header :class="['SiteLogo', {small: size === 'small'}]">
    <NuxtLink to="/">
      <h1>Spoon Fed</h1>
    </NuxtLink>
    <span class="subtitle">The Low-Spoons Meal Planner</span>
  </header>
</template>

<style scoped>
.SiteLogo {
  display: flex;
  flex-direction: column;
  text-align: center;
	line-height: initial;
  justify-content: center;

  h1 {
    font-family: "Chewy";
  }

  &.small {
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
    h1 {
      font-size: 2rem;
      margin: 0;
    }
    .subtitle {
      font-size: 1rem;
      color: var(--p-text-muted-color);
      border-style: solid;
      border-color: var(--p-content-border-color);
      border-width: 1px 0 1px 0;
      display: flex;
      align-items: center;
      padding: 0.25rem 0.3rem 0.3rem;
      margin-top: 0.1rem;
    }
  }

  a:has(h1) {
    text-decoration: none;
    color: inherit;
  }
  h1 {
    font-size: 6rem;
    margin-bottom: 0.5rem;
  }
  .subtitle {
    font-size: 2rem;
  }
}
</style>