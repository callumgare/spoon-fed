import {
	createPaprikaResponse,
	getPaprikaClient,
} from "~/lib/server-routes/utils";

export default defineEventHandler(async (event) => {
	return createPaprikaResponse(() =>
		getPaprikaClient(event).status({ cacheTtl: 30 * 1000 }),
	);
});
