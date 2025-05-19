<script setup lang="ts">
const settings = useSettingsStore();

if (settings.value.auth) {
	await navigateTo("/");
}
</script>

<template>
	<div class="LoginPage">
		<SiteLogo />
		<LoginForm />
	</div>
</template>

<style scoped>
.LoginPage {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	min-height: 80vh;
	gap: 3rem;
	margin: 2rem;
}
</style>