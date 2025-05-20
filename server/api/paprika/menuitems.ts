import {
	createPaprikaResponse,
	getGzippedPayload,
	getPaprikaClient,
} from "~/lib/server-routes/utils";

export default defineEventHandler(async (event) => {
	return createPaprikaResponse(async () => {
		if (event.method === "GET") {
			// menuitems is used for getting recipe selections so we don't
			// want to cache this and risk returning stale selections
			return getPaprikaClient(event).menuItems({ cacheTtl: 0 })
		}
		if (event.method === "POST") {
			const payload = await getGzippedPayload(event)
			return await getPaprikaClient(event).upsertMenuItems(payload, { cacheTtl: 0 })
		}
		throw Error(`Invalid method: ${event.method}`)
	});
});
