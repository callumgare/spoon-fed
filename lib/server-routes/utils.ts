import type { EventHandlerRequest, H3Event } from "h3";
import { Paprika } from "../paprika/client";
import { PaprikaApiInvalidLoginDetailsError } from "../paprika/errors";

// We cache client objects rather than creating them on every request since
// each object instantiates a Cache() object which might have it's own in-memory
// cache or open a connection to an external data source. Thus caching the
// paprika client also caches this Cache() object with it's connections or
// in-memory cache.
const clientCache: Record<string, Paprika | undefined> = {};

export function getPaprikaClient(event: H3Event<EventHandlerRequest>) {
	const headers = getHeaders(event);
	const auth = headers.authorization?.trim().split(/\s+/)[1];
	if (!auth) {
		throw new PaprikaApiInvalidLoginDetailsError();
	}
	let client = clientCache[auth];
	if (!client) {
		client = new Paprika({ auth });
		clientCache[auth] = client;
	}
	return client;
}

export async function createPaprikaResponse(getRes: () => Promise<unknown>) {
	try {
		return {
			result: await getRes(),
		};
	} catch (error) {
		if (error instanceof PaprikaApiInvalidLoginDetailsError) {
			return new Response(
				JSON.stringify({
					error: { code: 0, message: "Invalid or expired credentials." },
				}),
				{
					status: 401,
					headers: { "content-type": "application/json" },
				},
			);
		}
		throw error;
	}
}
