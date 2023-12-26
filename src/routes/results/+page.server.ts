import type { PageServerLoad } from './$types';
import { countResultsByLevel, getAllResults, getRecentResults } from '$lib/results/async';

export const load: PageServerLoad = async () => {
	const allResults = await getAllResults(false, 24);
	const recents = await getRecentResults(false, 5);
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
		// const allTournamentsOfLevel = await getAllTournamentsByLevel(level);
		// @ts-ignore
		const pretty: string = levelToPretty[level];
		// @ts-ignore
		countsByLevel[pretty] = await countResultsByLevel(level);
		// countsByLevel[pretty] = allTournamentsOfLevel.length;
		// @ts-ignore
		countsByLevel['Total'] += countsByLevel[pretty];
	}
	return {
		countsByLevel: countsByLevel,
		recents: recents,
		allResults: allResults
	};
};
