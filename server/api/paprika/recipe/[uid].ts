import { z } from "zod";
import { useProxiedPictureUrls } from "~/lib/picture-proxy";
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
		let recipe = await paprika.recipe(uid, { hash });
		recipe = await useProxiedPictureUrls(recipe)
		return recipe
	});
});
