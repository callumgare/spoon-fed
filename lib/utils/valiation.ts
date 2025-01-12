import { Paprika } from "~/lib/paprika/client";

export async function loginDetailsAreValid(loginDetails: {
	email: string;
	password: string;
}): Promise<boolean> {
	const headers = {
		Authorization: `Basic ${Paprika.getAuth(loginDetails)}`,
	};
	return await $fetch("/api/validate-login", { headers });
}
