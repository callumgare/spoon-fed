export class PaprikaApiError extends Error {
	constructor(message?: string) {
		super(message || "Unsuccessful request to Paprika API");

		// Explicitly set the prototype to maintain the correct prototype chain is
		// required for "instanceOf" to work as expected
		Object.setPrototypeOf(this, PaprikaApiError.prototype);
	}
}

export class PaprikaApiInvalidLoginDetailsError extends PaprikaApiError {
	constructor() {
		super("Invalid login details");

		// Explicitly set the prototype to maintain the correct prototype chain is
		// required for "instanceOf" to work as expected
		Object.setPrototypeOf(this, PaprikaApiInvalidLoginDetailsError.prototype);
	}
}
