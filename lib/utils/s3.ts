/**
 * @returns the number of milliseconds remaining until expiry (0 indicates it's already 
 * expired) or undefined meaning the url does not indicate any expiry date
 */
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
		return Math.max(expiresIn, 0);
	} catch (error) {
		return undefined;
	}
}
