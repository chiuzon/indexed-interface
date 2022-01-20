import { INDEX_POOLS } from '$lib/constants';

export function findIndexPoolById(id: string) {
	const indxPls = Object.entries(INDEX_POOLS).find((entry) => {
		if (Object.keys(entry[1]).includes(id)) {
			return true;
		}

		return false;
	});

	return indxPls ? indxPls[1][id] : undefined;
}
