import type { EventHandlerRequest, H3Event } from "h3";
import { Paprika } from "../paprika/client";
import { PaprikaApiInvalidLoginDetailsError } from "../paprika/errors";

export function getPaprikaClient(event: H3Event<EventHandlerRequest>) {
	const headers = getHeaders(event);
	const auth = headers.authorization?.trim().split(/\s+/)[1];
	if (!auth) {
		throw new PaprikaApiInvalidLoginDetailsError();
	}
	return new Paprika({ auth });
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
