export function getExpiresInFromUrl(url: string): number | undefined {
	if (!url) {
		return undefined;
	}
	try {
		const expiryParam = new URL(url).searchParams.get("Expires");
		if (!expiryParam) {
			// Url has no expiry param
			return undefined;
		}
		const expiryTimestampInSeconds = Number.parseInt(expiryParam);
		if (Number.isNaN(expiryTimestampInSeconds)) {
			logger.warn(`URL has an expiry param but it's not a number: ${expiryParam}`)
			return undefined;
		}
		const expiresIn = expiryTimestampInSeconds * 1000 - Date.now();
		if (expiresIn >= 0) {
			return expiresIn;
		}
		return undefined;
	} catch (error) {
		return undefined;
	}
}
