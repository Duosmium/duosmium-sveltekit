import type { PageServerLoad } from './$types';
import { objectToYAML } from '$lib/results/helpers';
import { getResult } from '$lib/results/async';

export const load = (async ({ params }) => {
	const yaml = getResult(params.id).then(objectToYAML);
	return {
		yaml: yaml
	};
}) satisfies PageServerLoad;
