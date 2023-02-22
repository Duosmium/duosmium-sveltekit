import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getResult, objectToYAML } from '$lib/helpers';
import { tournamentTitle } from '../../../lib/helpers';
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
	const title = tournamentTitle((await yaml.then(getInterpreter)).tournament)
	return {
		slug: params.slug,
		yaml: yaml,
		title: title
	};
}) satisfies PageServerLoad;