// noinspection JSUnusedGlobalSymbols

import type { RequestHandler } from './$types';
import { getAllResults } from '$lib/async';
import { JSON_OPTIONS } from '$lib/helpers';

export const GET = (async () => {
	const allResults = await getAllResults();
	const json = JSON.stringify(allResults);
	return new Response(json, JSON_OPTIONS);
}) satisfies RequestHandler;