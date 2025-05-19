import Keyv, { type KeyvOptions } from "keyv";
import type { Promisable } from "type-fest";

// number is in milliseconds
export type CacheTtlParam<T> =
	| number
	| undefined
	| ((data: T) => Promisable<number | undefined>);

export class Cache {
	async get(key: string) {
		if (typeof window !== "undefined") {
			const storedResult = JSON.parse(
				window.localStorage.getItem(key) ?? "null",
			);
			if (!storedResult) {
				return undefined;
			}
			if (
				storedResult.expiresOn !== null &&
				storedResult.expiresOn < Date.now()
			) {
				await this.delete(key);
				return undefined;
			}
			return storedResult.data;
		}
		const keyv = await this.getKeyv();
		return keyv.get(key);
	}
	async set<T>(
		key: string,
		value: T,
		{ cacheTtl }: { cacheTtl?: CacheTtlParam<T> } = {},
	): Promise<boolean> {
		const cacheTtlNumber =
			typeof cacheTtl === "function" ? await cacheTtl(value) : cacheTtl;
		if (cacheTtlNumber === 0) {
			return true;
		}
		if (typeof window !== "undefined") {
			window.localStorage.setItem(
				key,
				JSON.stringify({
					expiresOn:
						typeof cacheTtlNumber === "number"
							? Date.now() + cacheTtlNumber
							: null,
					data: value,
				}),
			);
			return true;
		}
		const keyv = await this.getKeyv();
		return await keyv.set(key, value, cacheTtlNumber);
	}
	async delete(key: string): Promise<boolean> {
		if (typeof window !== "undefined") {
			window.localStorage.removeItem(key);
			return true;
		}
		const keyv = await this.getKeyv();
		return await keyv.delete(key);
	}
	async memo<T>(
		keys: string | string[],
		getSource: () => Promisable<T>,
		{ cacheTtl, additionalCacheSetKeys }: { cacheTtl?: CacheTtlParam<T>, additionalCacheSetKeys?: string[] } = {},
	): Promise<T> {
		let result: T | undefined = undefined
		const cacheGetKeys = Array.isArray(keys) ? keys : [keys]
		for (const key of cacheGetKeys) {
			result = await this.get(key);
			if (result !== undefined) {
				break;
			}
		}
		if (!result) {
			result = await getSource();
			const cacheSetKeys = [...cacheGetKeys, ...(additionalCacheSetKeys ?? [])]
			for (const key of cacheSetKeys) {
				await this.set(key, result, { cacheTtl });
			}
		}
		return result;
	}
	private keyv: Keyv | undefined;
	private getKeyv = async () => {
		if (!this.keyv) {
			// We import dynamically so that Cache can be used in the browser
			const cacheUrl = (
				process.env.CACHE_URL || process.env.CACHE_KV_URL
			)?.trim();
			const options: KeyvOptions = {};
			if (!cacheUrl) {
				// CACHE_URL not set so only a memory cache is used
			} else if (
				cacheUrl.startsWith("redis://") ||
				cacheUrl.startsWith("rediss://")
			) {
				const { default: KeyvRedis } = await import("@keyv/redis");
				options.store = new KeyvRedis(cacheUrl);
			} else {
				const { KeyvFile } = await import("keyv-file");
				options.store = new KeyvFile({
					filename: cacheUrl,
					writeDelay: 100,
				});
			}
			this.keyv = new Keyv(options);
		}
		return this.keyv;
	};
}
