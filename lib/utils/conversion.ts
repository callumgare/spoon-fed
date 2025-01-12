export function getFirst<T>(value: T | T[]) {
	return Array.isArray(value) ? value[0] : value;
}
