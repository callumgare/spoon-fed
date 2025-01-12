export const asyncRatelimit = async function* <T>(
	funcs: (() => Promise<T>)[],
	rate: number,
): AsyncGenerator<T> {
	for (const [index, func] of funcs.entries()) {
		const [result] = await Promise.all([
			func(),
			new Promise<void>((resolve) =>
				index + 1 === funcs.length ? resolve() : setTimeout(resolve, rate),
			),
		]);
		yield result;
	}
};

export class RateLimiter {
	private rate: number;
	private promiseChain: Promise<unknown> | undefined;
	constructor(rate: number) {
		this.rate = rate;
	}
	async waitTillReadyForNext() {
		return new Promise((resolve) => {
			this.promiseChain = (this.promiseChain || Promise.resolve())
				.then(resolve)
				.then(() => new Promise((resolve) => setTimeout(resolve, this.rate)));
		});
	}
}
