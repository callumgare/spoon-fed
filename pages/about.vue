<script setup lang="ts">
import packageJson from "../package.json";
</script>

<template>
	<div class="AboutPage">
		<SiteLogo />
		<div>
			<p>
				Spoon Fed is a hobby project of <a href="callum.gare.au">Callum Gare</a> built simply because they suck at meal planning and wanted something like Spoon Fed to exist to help them. Since it doesn't really cost anything to run they've also made it public incase it helps anyone else :) It's open-source and if you're interested it's <a :href="packageJson.repository">available on GitHub</a>.
			</p>
			<p>
				<a href="mailto:callum@gare.au">Shoot me a message</a> if you find it helpful (I'd love to hear about it) or if you have any other comments/questions.
			</p>
		</div>
		<AccountSafetyInfo />
	</div>
</template>

<style scoped>
.AboutPage {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	min-height: 80vh;
	gap: 3rem;
	max-width: 50rem;
	margin: auto;
	line-height: 1.5;
	font-size: 1.1rem;
}
</style>