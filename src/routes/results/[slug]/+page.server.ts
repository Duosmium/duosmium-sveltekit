import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getResult, objectToYAML } from '$lib/helpers';

async function getResultWrapper(duosmiumID: string) {
	let result;
	try {
		result = await getResult(duosmiumID)
	} catch (e) {
		throw error(404, "Result not found!")
	}
	return result
}

export const load = (({ params }) => {
	const yaml = getResultWrapper(params.slug).then(objectToYAML);
	return {
		slug: params.slug,
		yaml: yaml,
	};
}) satisfies PageServerLoad;