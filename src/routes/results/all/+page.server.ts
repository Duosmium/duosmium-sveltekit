import type { PageServerLoad } from './$types';
import { getFromAPI } from '$lib/global/api';

export const load: PageServerLoad = async () => {
	const resultsBySeason = await getFromAPI('/results/seasons');
	const seasons: number[] = Object.keys(resultsBySeason)
		.map((k) => Number(k))
		.reverse();
	return {
		seasons: seasons,
		resultsBySeason: resultsBySeason
	};
};
