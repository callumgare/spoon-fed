import { createGlobalState, useLocalStorage } from "@vueuse/core";

export type Settings = {
	auth: string;
	email: string;
};

export const useSettingsStore = createGlobalState(() =>
	useLocalStorage<Settings>(
		"settings",
		{ auth: "", email: "" },
		{ mergeDefaults: true, initOnMounted: true },
	),
);
