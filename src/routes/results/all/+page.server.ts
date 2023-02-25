import type { PageServerLoad } from './$types';
import { db } from '$lib/database';
import { getInterpreter } from '../../../lib/interpreter';
import { dateString, objectToYAML, tournamentTitle } from '../../../lib/helpers';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type Interpreter from 'sciolyff/interpreter';
import strftime from 'strftime';

async function getAllResults() {
	const basic = await db.collection("results").find().toArray();
	basic.sort((a, b) => (a["duosmium_id"] > b["duosmium_id"]) ? -1 : 1);
	return basic;
}

export const load = (async () => {
	const results = await getAllResults();
	const interpreters: Interpreter[] = results.map(r => getInterpreter(objectToYAML(r["result"])));
	const ids = results.map(r => r["duosmium_id"]);
	const names = interpreters.map(i => i.tournament.year + " " + tournamentTitle(i.tournament) + " (" + dateString(i) + ")");
	return {
		ids: ids,
		names: names
	};
}) satisfies PageServerLoad;