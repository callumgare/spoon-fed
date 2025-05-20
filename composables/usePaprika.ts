import { Paprika } from "~/lib/paprika/client";
import { createGlobalState } from '@vueuse/core'

export const usePaprika = createGlobalState(
  () => {
		const settings = useSettingsStore();

		return computed(() => {
			if (settings.value.auth) {
				return new Paprika({
					auth: settings.value.auth,
					rootUrl: "/api/paprika",
					rateLimit: 1000 * 1, // Rate limit to 1 per second
				});
			}
			return null;
		});
	}
)
