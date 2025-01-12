import { Paprika } from "../../lib/paprika/client";

export default defineEventHandler(async (event) => {
	const headers = getHeaders(event);
	const auth = headers.authorization?.trim().split(/\s+/)[1];
	if (!auth) {
		throw Error("Invalid Authorization header");
	}
	return await new Paprika({ auth }).loginDetailsAreValid();
});
