import {
	createPaprikaResponse,
	getGzippedPayload,
	getPaprikaClient,
} from "~/lib/server-routes/utils";

export default defineEventHandler(async (event) => {
	return createPaprikaResponse(async () => {
		if (event.method === "GET") {
			return getPaprikaClient(event).menus({ cacheTtl: 10 * 1000 })
		}
		if (event.method === "POST") {
			const payload = await getGzippedPayload(event)
			return getPaprikaClient(event).upsertMenus(payload)
		}
		throw Error(`Invalid method: ${event.method}`)
	});
});
