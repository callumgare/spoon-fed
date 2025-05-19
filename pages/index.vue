<script setup lang="ts">
const settings = useSettingsStore();
</script>

<template>
	<div class="HomePage">
		<SiteLogo />
		<div class="description">
			<p>
				Do you use <a href="https://www.paprikaapp.com/">Paprika</a> to store your recipes but find weekly meal planing too hard? Spoon Fed makes it easy. Simply:
			</p>
			<ol>
				<li>Login with your Paprika sync account</li>
				<li>Select which recipes you'd like to make</li>
				<li>Check the shopping list tab next time you're shopping to see the ingredients you'll need</li>
			</ol>
			<p>
				Paprika is a great app and its built-in meal planer might already do exactly what you want. However if its approach of requiring meals to be scheduled in on specific dates is something you find a little overwhelming (or just a greater level of detail than necessary) then give Spoon Fed a try.
			</p>
			<p>
				With Spoon Fed you simply pick which recipes you'd like to make and use the generated shopping list to let you know what ingredients you need to pickup when you're at the shops. Then you can decide on a day-by-day basis what you'd like to make knowing you already have everything you need for each recipe.
			</p>
		</div>
		<img src="/images/recipe-cards-screenshot.png" />
		<Button
			v-if="!settings.auth"
			as="router-link"
			label="Login With Paprika Account"
			to="/login"
			class="ctaButton login"
		/>
		<Button
			v-else
			as="router-link"
			label="Show Recipes"
			to="/app"
			class="ctaButton openApp"
		/>
		<NuxtLink to="/about">More info</NuxtLink>
	</div>
	
</template>

<style scoped>
.HomePage {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: safe center;
	min-height: 80vh;
	gap: 4rem;
	margin: 2rem 2rem 4rem;

	font-size: 1.2rem;
	line-height: 1.8rem;

	p {
		max-width: 60rem;
	}

	ol {
		li {
			margin: 1rem 0;
		}
	}

	img {
		margin: auto;
		max-width: 100%;
		display: block;
	}

	.ctaButton {
		text-decoration: none;
	}
}
</style>