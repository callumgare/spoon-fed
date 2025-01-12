<script setup lang="ts">
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
</script>
<template>
  <slot />
</template>

<style>
html {
  font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  font-family: Inter var, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
  font-size: 14px;
  line-height: normal
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
