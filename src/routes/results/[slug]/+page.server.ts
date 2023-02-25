import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getResult, objectToYAML } from '$lib/helpers';
import { dateString, tournamentTitle, tournamentTitleShort } from '../../../lib/helpers';
import { getInterpreter } from '../../../lib/interpreter';

async function getResultWrapper(duosmiumID: string) {
	let result;
	try {
		result = await getResult(duosmiumID)
	} catch (e) {
		throw error(404, "Result not found!")
	}
	return result
}

export const load = (async ({ params }) => {
	const yaml = getResultWrapper(params.slug).then(objectToYAML);
	const interpreter = await yaml.then(getInterpreter);
	const title = tournamentTitle(interpreter.tournament);
	const shortTitle = tournamentTitleShort(interpreter.tournament);
	const date = dateString(interpreter);
	return {
		slug: params.slug,
		yaml: yaml,
		title: title,
		shortTitle: shortTitle,
		dateString: date,
	};
}) satisfies PageServerLoad;