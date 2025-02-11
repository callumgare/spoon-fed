import {
	createPaprikaResponse,
	getPaprikaClient,
} from "~/lib/server-routes/utils";

export default defineEventHandler(async (event) => {
	return createPaprikaResponse(() =>
		getPaprikaClient(event).recipes({ cacheTtl: 10 * 1000 }),
	);
});
