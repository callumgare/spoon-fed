<script setup lang="ts">
import { useSettings } from "~/composables/useSettings";
const settings = useSettings();
</script>

<template>
	<MainView v-if="settings.auth" />
	<IntroView v-else />
</template>

<style scoped>
.tabs {
	.p-tablist {
		position: sticky;
  	top: 0;
	}

	@media (max-width: 500px) {
		.p-tablist {
			order: 2;
			top: initial;
			bottom: 0;
		}
	}
}
</style>