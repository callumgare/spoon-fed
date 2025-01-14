<script setup lang="ts">
</script>

<template>
	<div class="IntroView">
		<SiteLogo />
		<div class="description">
			<p>
				Do you use <a href="https://www.paprikaapp.com/">Paprika</a> to store your recipes but find weekly meal planing too hard? Spoon Fed makes it easy. Simply:
			</p>
			<ol>
				<li>Login with your Paprika sync account</li>
				<li>Select which recipes you'd like to make</li>
				<li>Use the created shopping list to buy the ingredients</li>
			</ol>
			<p>
				Spoon Fed was design especially with neurodivergent people in mind but it works for everyone! Paprika is a great app and it's built-in approach to meal planer might do exactly what you want. However if you find scheduling in meals for specific dates overwhelming or simply more detail than necessary then give Spoon Fed a try.
			</p>
			<p>
				Spoon Fed doesn't feature any scheduling, you simply pick which recipes you think you'd like to make then once you've bought the ingredients you'll have everything you need to make those recipes and you can decide what you want to make day-by-day.
			</p>
		</div>
		<img src="/images/recipe-cards-screenshot.png" />
		<Button as="router-link" label="Login With Paprika Account" to="/login" class="login" />
	</div>
	
</template>

<style scoped>
.IntroView {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: safe center;
	min-height: 80vh;
	gap: 4rem;
	margin-bottom: 4rem;

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

	.login {
		text-decoration: none;
	}
}
</style>