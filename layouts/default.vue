<script setup lang="ts">
import usePageHeightCSS from '~/composables/usePageHeightCSS';

useHead({
	title: "Spoon Fed",
	meta: [
		{ name: "apple-mobile-web-app-title", content: "Spoon Fed" },
		{
			name: "viewport",
			content: "width=device-width, initial-scale=1, maximum-scale=1",
		},
	],
	link: [
		{
			rel: "icon",
			type: "image/png",
			href: "/favicon-96x96.png",
			sizes: "96x96",
		},
		{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
		{ rel: "shortcut icon", type: "image/svg+xml", href: "/favicon.ico" },
		{
			rel: "apple-touch-icon",
			sizes: "180x180",
			href: "/apple-touch-icon.png",
		},
		{ rel: "manifest", href: "/site.webmanifest" },
	],
});

usePageHeightCSS()
</script>
<template>
  <slot />
</template>

<style>
html {
  font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  font-family: Inter var, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
  font-size: 14px;
  line-height: normal;

	--brand-color-1: #F6F7D4;
	--brand-color-2: #D2F6C5;
	--brand-color-3: #99F3BD;
	--brand-color-4: #28df99;
	
	--page-background-transparency: 80%;
	--page-background-tint: white;
	@media (prefers-color-scheme: dark) {
		--page-background-transparency: 60%;
		--page-background-tint: black;
	}
	--page-background: 
		linear-gradient(
			134deg,
			color-mix(in hsl, var(--brand-color-1), transparent var(--page-background-transparency)) 0%, 
			color-mix(in hsl, var(--brand-color-2), transparent var(--page-background-transparency)) 33%, 
			color-mix(in hsl, var(--brand-color-3), transparent var(--page-background-transparency)) 66%, 
			color-mix(in hsl, var(--brand-color-4), transparent var(--page-background-transparency)) 100%
		),
		var(--page-background-tint);
	background-color: var(--p-content-background);
	background: var(--page-background);
	
	min-height: 100vh;

	--p-tabs-tablist-background: transparent !important;
	--p-tabs-tabpanel-background: transparent !important;
	--p-fieldset-background: transparent !important;
	--p-fieldset-legend-background: transparent !important;
	
}

body {
	margin: 0;
}

:root {
	@media (prefers-color-scheme: light) {
		--p-content-border-color: var(--p-surface-300);
		--p-text-color: var(--p-surface-800);
	}
	@media (prefers-color-scheme: dark) {
		--p-text-muted-color: var(--p-surface-300);
		--p-text-color: var(--p-surface-100);
	}
	color: var(--p-text-color);
}

/* Taken from https://css-tricks.com/inclusively-hidden/ */
.sr-only:not(:focus):not(:active) {
  clip: rect(0 0 0 0); 
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap; 
  width: 1px;
}

/* Hack to fix https://github.com/primefaces/primevue/issues/5804 */
.p-iconfield:has(.p-password) {
  .p-inputicon {
    z-index: 2;
  }
  .p-password input {
    padding-left: calc((var(--p-form-field-padding-x)* 2) + var(--p-icon-size)); padding-right: var(--p-form-field-padding-x);
  }
}
</style>
