import packageJson from "../../package.json";
import { Cache, type CacheTtlParam } from "../cache/client";
import { RateLimiter } from "../utils/flow";
import { getExpiresInFromUrl } from "../utils/s3";
import { hash } from "ohash";
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
	rateLimit?: number;
} & LoginDetails;

type EndpointSharedOptions<T> = {
	cacheTtl?: CacheTtlParam<T>;
	cacheKey?: string;
	additionalCacheSetKeys?: string[],
};

export class Paprika {
	private rootUrl = "https://www.paprikaapp.com/api/v1/sync";
	private auth: string;
	private userHash: string | undefined;
	private rateLimiter: RateLimiter | undefined;
	private cache = new Cache();

	constructor(props: ConstructorProps) {
		this.auth = Paprika.getAuth(props);
		if (props.rootUrl) {
			this.rootUrl = props.rootUrl;
		}
		if (props.rateLimit) {
			this.rateLimiter = new RateLimiter(props.rateLimit);
		}
	}

	async recipes(options: EndpointSharedOptions<RecipeIndexItem[]> = {}) {
		return await this.fetch<RecipeIndexItem[]>("recipes", options);
	}

	async recipe(
		uid: string,
		options: EndpointSharedOptions<Recipe> & { hash?: string } = {},
	) {
		// The hash query param isn't used by the actual paprika url, just our
		// proxy so we know if the cached copy has expired or not
		return await this.fetch<Recipe>(`recipe/${uid}?hash=${options.hash ?? ""}`, {
			// Ideally we could always cache this forever because of of the content hash included in the url which is
			// in turn included in the cacheKey but photo_url isn't included in the hash calculation and changes on
			// every request due to only being is only valid for 10 minutes.
			cacheTtl: options.hash
				// If we have the recipe hash then cache till photo_url expires or in an hour if no expiry
				? (data) => getExpiresInFromUrl(data.photo_url) ?? 1000 * 60 * 60
				// Otherwise cache for a minute
				: 1000 * 60,
			cacheKey: `recipe/${uid}:${options.hash || "latest"}`,
			additionalCacheSetKeys: options.hash !== "latest" ? [`recipe/${uid}:${"latest"}`] : undefined,
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
		if (!this.userHash) {
			this.userHash = await hash(this.auth);
		}
		const { cacheKey, additionalCacheSetKeys } = options;
		const fullCacheKey = `paprika:${this.userHash}:${cacheKey ? cacheKey : endpointPath}`;
		const fullAdditionalCacheSetKeys = additionalCacheSetKeys?.map(additionalCacheSetKey => `paprika:${this.userHash}:${additionalCacheSetKey}`);
		return this.cache.memo(
			fullCacheKey,
			async () => {
				if (this.rateLimiter) {
					await this.rateLimiter.waitTillReadyForNext();
				}
				logger.info(`Sending request to paprika: ${endpointPath}`)
				logger.info(`Cache key: ${fullCacheKey}`)
				if (fullAdditionalCacheSetKeys) {
					logger.info(`Additional cache set keys: ${fullAdditionalCacheSetKeys.join(', ')}`)
				}
				const headers = this.getHeaders();
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
			{ 
				cacheTtl: "cacheTtl" in options ? options.cacheTtl : 0,
				additionalCacheSetKeys: fullAdditionalCacheSetKeys
			},
		);
	}

	getHeaders() {
		return {
			Authorization: `Basic ${this.auth}`,
			"User-Agent": `spoon-fed (see ${packageJson.repository} for more info and contact ${packageJson.author} if there are any issues)`,
		}
	}
}
