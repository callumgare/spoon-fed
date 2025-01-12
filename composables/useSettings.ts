import { createGlobalState, useLocalStorage } from "@vueuse/core";

export type Settings = {
	auth: string;
	email: string;
};

export const useSettings = createGlobalState(() =>
	useLocalStorage<Settings>(
		"settings",
		{ auth: "", email: "" },
		{ mergeDefaults: true },
	),
);
