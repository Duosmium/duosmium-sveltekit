import { getResult, objectToYAML } from '$lib/helpers';
import type { RequestHandler } from './$types';

export const GET = (async ({ params }) => {
	const yaml = await getResult(params.slug).then(objectToYAML);
	return new Response(await yaml, {
		status: 200,
		headers: {
			'Content-type': 'text/yaml',
			'Content-Disposition': 'attachment; filename=' + params.slug + '.yaml'
		}
	});
}) satisfies RequestHandler;
