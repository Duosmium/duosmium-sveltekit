import { getResult, objectToYAML } from '$lib/helpers';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

async function getResultWrapper(duosmiumID: string) {
	let result;
	try {
		result = await getResult(duosmiumID.replace(".yaml", ""))
	} catch (e) {
		throw error(404, "Result not found!")
	}
	return result
}

export const GET = (async ({ params }) => {
	const yaml = getResultWrapper(params.slug).then(objectToYAML);
	return new Response(await yaml, {
		status: 200,
		headers: {
			"Content-type" : "text/yaml",
			"Content-Disposition": "attachment; filename="+params.slug+".yaml"
		}
	})
}) satisfies RequestHandler;