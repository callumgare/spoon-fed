import Keyv, { type KeyvStoreAdapter } from "keyv";

export class Cache {
	async get(key: string) {
		if (typeof window !== "undefined") {
			return JSON.parse(window.localStorage.getItem(key) ?? "null");
		}
		const keyv = await this.getKeyv();
		return keyv.get(key);
	}
	async set(key: string, value: unknown, cacheTtl?: number) {
		if (typeof window !== "undefined") {
			return window.localStorage.setItem(key, JSON.stringify(value));
		}
		const keyv = await this.getKeyv();
		return keyv.set(key, value, cacheTtl);
	}
	private keyv: Keyv | undefined;
	private getKeyv = async () => {
		if (!this.keyv) {
			// We import dynamically so that Cache can be used in the browser
			const cacheUrl = process.env.CACHE_URL?.trim();
			if (!cacheUrl) {
				throw Error("CACHE_URL not set");
			}
			let store: KeyvStoreAdapter | undefined;
			if (cacheUrl.startsWith("/")) {
				const { KeyvFile } = await import("keyv-file");
				store = new KeyvFile({
					filename: cacheUrl,
					writeDelay: 100,
				});
			} else if (cacheUrl.startsWith("redis://")) {
				const { default: KeyvRedis } = await import("@keyv/redis");
				store = new KeyvRedis(cacheUrl);
			} else {
				throw Error(`CACHE_URL is invalid: ${cacheUrl}`);
			}
			this.keyv = new Keyv({ store: store });
			this.keyv = new Keyv();
		}
		return this.keyv;
	};
}
