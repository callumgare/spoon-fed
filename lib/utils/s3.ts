export function getExpiresInFromUrl(url: string): number | undefined {
	if (!url) {
		return undefined;
	}
	try {
		const expiryParam = new URL(url).searchParams.get("Expires");
		if (!expiryParam) {
			return undefined;
		}
		const expiryTimestampInSeconds = Number.parseInt(expiryParam);
		if (Number.isNaN(expiryTimestampInSeconds)) {
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
