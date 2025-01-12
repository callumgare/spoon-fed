import Aura from "@primevue/themes/aura";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	app: {
		head: {
			charset: "utf-8",
			viewport: "width=device-width, initial-scale=1, maximum-scale=1",
		},
	},
	devtools: { enabled: true },
	modules: ["@primevue/nuxt-module"],
	components: [
		{
			path: "~/components",
			pathPrefix: false,
		},
		{
			path: "~/views",
			pathPrefix: false,
		},
	],
	primevue: {
		options: {
			theme: {
				preset: Aura,
			},
		},
	},
	css: ["primeicons/primeicons.css"],
});
