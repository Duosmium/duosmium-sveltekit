import type { PageServerLoad } from './$types';
import { getInterpreter } from '$lib/results/interpreter';
import { dateString, objectToYAML, tournamentTitle } from '$lib/results/helpers';
import { getAllResults } from '$lib/results/async';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type Interpreter from 'sciolyff/interpreter';

export const load = (async () => {
	const results = await getAllResults();
	const interpreters: Interpreter[] = [];
	for (const duosmiumID in results) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const result = results[duosmiumID];
		interpreters.push(getInterpreter(objectToYAML(result)));
	}
	const ids = Object.keys(results);
	const names = interpreters.map(
		(i) =>
			i.tournament.year +
			' ' +
			tournamentTitle(i.tournament) +
			' (Div. ' +
			i.tournament.division.toUpperCase() +
			') — ' +
			dateString(i) +
			' @ ' +
			i.tournament.location
	);
	return {
		ids: ids,
		names: names
	};
}) satisfies PageServerLoad;
