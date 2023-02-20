import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '../../../lib/database';
import { dump } from 'js-yaml';

const sciolyff = (await import("sciolyff")).default

async function getInterpreter(rep: string) {
	return new sciolyff.Interpreter(rep)
}

async function getJSON(duosmiumID: string) {
	// const projection = { result: 1 };
	const matches = await db.collection("results").find({duosmium_id: duosmiumID});
	const numOfMatches = await db.collection("results").countDocuments({duosmium_id: duosmiumID})
	if (numOfMatches === 0) {
		return error(404, "No result found!")
	}
	const arr = await matches.toArray();
	return arr[0]["result"];
}

export const load = (({ params }) => {
	const json = getJSON(params.slug).then(JSON.stringify);
	const yaml = getJSON(params.slug).then(dump);
	return {
		slug: params.slug,
		json: json,
		yaml: yaml,
		interpreter: yaml.then(getInterpreter).toString()
	};
}) satisfies PageServerLoad;