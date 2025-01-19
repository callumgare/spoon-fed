import { Cache } from "~/lib/cache/client";

const cache = new Cache()


export default defineEventHandler(async (event) => {
	const oldResult = await cache.get("cake") || 0
	await cache.set("cake", oldResult + 1)
	return oldResult
});
