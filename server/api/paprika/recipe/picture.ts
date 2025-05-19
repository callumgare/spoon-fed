import { createPaprikaResponse, getPaprikaClient } from "~/lib/server-routes/utils";
import { getUpstreamPictureUrl } from "~/lib/picture-proxy";

export default defineEventHandler(async (event) => createPaprikaResponse(async () => {
	const url = getRequestURL(event)
	const paprika = getPaprikaClient(event);
	const upstreamPictureUrl = await getUpstreamPictureUrl(url.href, paprika)
	if (upstreamPictureUrl === null) {
		return new Error("Picture could not be retrieved")
	}
	try {
    setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
		setHeader(event, 'Vary', 'Authorization')
		return await sendProxy(event, upstreamPictureUrl)
	} catch (error) {
		logger.error(`Failed to load: ${upstreamPictureUrl}`);
		return new Error("Error when fetching picture")
	}
}));
