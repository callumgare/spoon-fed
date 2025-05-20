export class PaprikaApiError extends Error {
	constructor({message, body}: {message?: string, body?: string}) {
		if (!message) {
			message = "Unsuccessful request to Paprika API"
		}
		if (body) {
			let upstreamMessage: string
			try {
				const bodyData = JSON.parse(body)
				upstreamMessage = bodyData.error.message
			} catch (error) {
				upstreamMessage = body
			}

			message += ` (Response from Paprika: ${upstreamMessage})`
		}
		super(message);
		

		// Explicitly set the prototype to maintain the correct prototype chain is
		// required for "instanceOf" to work as expected
		Object.setPrototypeOf(this, PaprikaApiError.prototype);
	}
}

export class PaprikaApiInvalidLoginDetailsError extends PaprikaApiError {
	constructor() {
		super({message: "Invalid login details"});

		// Explicitly set the prototype to maintain the correct prototype chain is
		// required for "instanceOf" to work as expected
		Object.setPrototypeOf(this, PaprikaApiInvalidLoginDetailsError.prototype);
	}
}
