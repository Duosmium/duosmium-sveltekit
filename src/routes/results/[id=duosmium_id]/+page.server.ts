import type { PageServerLoad } from './$types';
import { getResult, objectToYAML } from '$lib/helpers';

export const load = (async ({ params }) => {
	const yaml = getResult(params.id).then(objectToYAML);
	return {
		yaml: yaml
	};
}) satisfies PageServerLoad;
