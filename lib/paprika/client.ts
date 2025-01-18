import packageJson from "../../package.json";
import { Cache, type CacheTtlParam } from "../cache/client";
import { getExpiresInFromUrl } from "../utils/s3";
import { hashString } from "../utils/security";
import { PaprikaApiError, PaprikaApiInvalidLoginDetailsError } from "./errors";
import type {
	Category,
	LoginDetails,
	Recipe,
	RecipeIndexItem,
	Status,
} from "./types";

type ConstructorProps = {
	rootUrl?: string;
} & LoginDetails;

type EndpointSharedOptions<T> = {
	cacheTtl?: CacheTtlParam<T>;
	cacheKey?: string;
};

export class Paprika {
	private rootUrl = "https://www.paprikaapp.com/api/v1/sync";
	private auth: string;
	private userHash: string | undefined;

	constructor(props: ConstructorProps) {
		this.auth = Paprika.getAuth(props);
		if (props.rootUrl) {
			this.rootUrl = props.rootUrl;
		}
	}

	async recipes(options: EndpointSharedOptions<RecipeIndexItem[]> = {}) {
		return await this.fetch<RecipeIndexItem[]>("recipes", options);
	}

	async recipe(
		uid: string,
		options: EndpointSharedOptions<Recipe> & { hash?: string },
	) {
		// The hash query param isn't used by the actual paprika url, just our
		// proxy so we know if the cached copy has expired or not
		return await this.fetch<Recipe>(`recipe/${uid}?hash=${options.hash}`, {
			cacheKey: options.hash,
			cacheTtl: options.hash
				? (data) => getExpiresInFromUrl(data.photo_url)
				: 0, // Ideally we could cache this forever because of hash as the cacheKey but photo_url isn't included in the hash calculation and changes on every request due to only being is only valid for 10 minutes,
			...options,
		});
	}

	async categories(options: EndpointSharedOptions<Category[]> = {}) {
		return await this.fetch<Category[]>("categories", options);
	}

	async status(options: EndpointSharedOptions<Status[]> = {}) {
		return await this.fetch<Status[]>("status", options);
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
		options: EndpointSharedOptions<T> = {},
	): Promise<T> {
		const cache = new Cache();
		if (!this.userHash) {
			this.userHash = await hashString(this.auth);
		}
		const { cacheKey } = options;
		const fullCacheKey = `paprika:${this.userHash}:${endpointPath}${cacheKey ? `:${cacheKey}` : ""}`;
		return cache.memo(
			fullCacheKey,
			async () => {
				const headers = {
					Authorization: `Basic ${this.auth}`,
					"User-Agent": `spoon-fed (see ${packageJson.repository} for more info and contact ${packageJson.author} if there are any issues)`,
				};
				const res = await fetch(
					`${this.rootUrl.replace(/\/+#/, "")}/${endpointPath}`,
					{ headers },
				);
				if (!res.ok) {
					if (res.status === 401) {
						throw new PaprikaApiInvalidLoginDetailsError();
					}
					throw new PaprikaApiError();
				}
				const resBody: { result: T } = await res.json();
				return resBody.result;
			},
			{ cacheTtl: "cacheTtl" in options ? options.cacheTtl : 0 },
		);
	}
}
