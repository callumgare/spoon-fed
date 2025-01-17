import { z } from "zod";
import {
	createPaprikaResponse,
	getPaprikaClient,
} from "~/lib/server-routes/utils";

export default defineEventHandler(async (event) => {
	return createPaprikaResponse(async () => {
		const { hash } = await getValidatedQuery(
			event,
			z.object({
				hash: z.string(),
			}).parse,
		);
		const { uid } = await getValidatedRouterParams(
			event,
			z.object({
				uid: z.string(),
			}).parse,
		);
		const paprika = getPaprikaClient(event);
		return paprika.recipe(uid, hash);
	});
});
