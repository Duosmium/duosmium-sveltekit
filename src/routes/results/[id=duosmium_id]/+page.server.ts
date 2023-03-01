import type { PageServerLoad } from './$types';
import { objectToYAML } from '$lib/helpers';
import { getResult } from '$lib/async';

export const load = (async ({ params }) => {
	const yaml = getResult(params.id).then(objectToYAML);
	return {
		yaml: yaml
	};
}) satisfies PageServerLoad;
