import packageJson from "../../package.json";
import { Cache } from "../cache/client";
import { hashString } from "../utils/security";
import { PaprikaApiError, PaprikaApiInvalidLoginDetailsError } from "./errors";
import type {
	Category,
	LoginDetails,
	Recipe,
	RecipeIndexItem,
	Status,
} from "./types";

export class Paprika {
	private rootUrl = "https://www.paprikaapp.com/api/v1/sync";
	private auth: string;
	private userHash: string | undefined;

	constructor(loginDetails: LoginDetails) {
		this.auth = Paprika.getAuth(loginDetails);
	}

	async recipes() {
		return await this.fetch<RecipeIndexItem[]>("recipes", {
			cacheTtl: 10 * 1000,
		});
	}

	async recipe(uid: string, hash: string) {
		return await this.fetch<Recipe>(`recipe/${uid}`, { cacheKey: hash });
	}

	async categories() {
		return await this.fetch<Category[]>("categories");
	}

	async status() {
		return await this.fetch<Status[]>("status", { cacheTtl: 30 * 1000 });
	}

	async loginDetailsAreValid(): Promise<boolean> {
		try {
			await this.status();
			return true;
		} catch (error) {
			if (error instanceof PaprikaApiInvalidLoginDetailsError) {
				return false;
			}
			throw error;
		}
	}

	static getAuth(loginDetails: LoginDetails) {
		return "auth" in loginDetails
			? loginDetails.auth
			: btoa(`${loginDetails.email}:${loginDetails.password}`);
	}

	private async fetch<T>(
		endpointPath: string,
		{ cacheKey, cacheTtl }: { cacheKey?: string; cacheTtl?: number } = {},
	): Promise<T> {
		const cache = new Cache();
		if (!this.userHash) {
			this.userHash = await hashString(this.auth);
		}
		const fullCacheKey = `paprika:${this.userHash}:${endpointPath}${cacheKey ? `:${cacheKey}` : ""}`;
		return cache.memo(
			fullCacheKey,
			async () => {
				const headers = {
					Authorization: `Basic ${this.auth}`,
					"User-Agent": `spoon-fed (see ${packageJson.repository} for more info and contact ${packageJson.author} if there are any issues)`,
				};
				const res = await fetch(`${this.rootUrl}/${endpointPath}`, { headers });
				if (!res.ok) {
					if (res.status === 401) {
						throw new PaprikaApiInvalidLoginDetailsError();
					}
					throw new PaprikaApiError();
				}
				const resBody: { result: T } = await res.json();
				return resBody.result;
			},
			{ cacheTtl },
		);
	}
}
