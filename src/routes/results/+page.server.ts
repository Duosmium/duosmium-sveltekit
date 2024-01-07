import type { PageServerLoad } from './$types';
import { getFromAPI } from '$lib/global/api';

export const load: PageServerLoad = async () => {
	const allResults = await getFromAPI('/results/recent');
	const recents = await getFromAPI('/results/latest');
	const counts = await getFromAPI('/results/count');
	const countsByLevel = {
		'National Tournaments': 0,
		'State Tournaments': 0,
		Regionals: 0,
		Invitationals: 0,
		Total: 0
	};
	const levelToPretty = {
		Nationals: 'National Tournaments',
		States: 'State Tournaments',
		Regionals: 'Regionals',
		Invitational: 'Invitationals'
	};
	for (const level of Object.keys(levelToPretty)) {
		const pretty = levelToPretty[level];
		countsByLevel[pretty] = counts[level];
		// @ts-ignore
		countsByLevel['Total'] += countsByLevel[pretty];
	}
	return {
		countsByLevel: countsByLevel,
		recents: recents,
		allResults: allResults
	};
};
