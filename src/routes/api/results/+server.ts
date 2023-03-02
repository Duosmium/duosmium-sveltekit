// noinspection JSUnusedGlobalSymbols

import type { RequestHandler } from './$types';
import {
	getAllResults,
	handleUploadedYAML,
	handlePOSTedJSON,
	deleteAllResults
} from '$lib/results/async';
import { exportYAMLOrJSON } from '$lib/results/helpers';

export const GET = (async ({ url }) => {
	const allResults = await getAllResults();
	return exportYAMLOrJSON(url, allResults, 'results');
}) satisfies RequestHandler;

export const POST = (async ({ request }) => {
	const data = await request.formData();
	const yaml = data.get('yaml');
	const json = data.get('result');
	let fileName;
	if (yaml instanceof File) {
		fileName = await handleUploadedYAML(yaml);
	} else if (json !== null && typeof json === 'object') {
		fileName = await handlePOSTedJSON(json);
	}
	return new Response(`Result ${fileName} created`, { status: 201 });
}) satisfies RequestHandler;

export const DELETE = (async () => {
	await deleteAllResults();
	return new Response(null, { status: 204 });
}) satisfies RequestHandler;
