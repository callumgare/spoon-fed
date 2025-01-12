import { getFirst } from "~/lib/utils/conversion";
import { Paprika } from "../../lib/paprika/client";

export default defineEventHandler(async (event) => {
	const query = getQuery<Record<string, string | string[]>>(event);
	const id = getFirst(query.id);
	const hash = getFirst(query.hash);
	const headers = getHeaders(event);
	const auth = headers.authorization?.trim().split(/\s+/)[1];
	if (!auth) {
		throw Error("Invalid Authorization header");
	}
	if (!id) {
		throw Error("Missing recipe id");
	}
	if (!hash) {
		throw Error("Missing recipe hash");
	}
	const paprika = new Paprika({ auth });
	return await paprika.recipe(id, hash);
});
