<script setup lang="ts">
const settings = useSettingsStore();
</script>

<template>
	<MainView v-if="settings.auth" />
	<IntroView v-else />
</template>

<style scoped>
</style>