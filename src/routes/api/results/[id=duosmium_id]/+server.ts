// noinspection JSUnusedGlobalSymbols

import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getResult } from '$lib/async';
import { JSON_OPTIONS } from '$lib/helpers';

export const GET = (async ({ url }) => {
	const duosmiumID = url.pathname.split("/").pop();
	if (duosmiumID === undefined) {
		throw error(400, "No result specified!");
	} else {
		try {
			const json = JSON.stringify(await getResult(duosmiumID)).replaceAll("T00:00:00.000Z", "");
			return new Response(json, JSON_OPTIONS);
		}	catch (e) {
			throw error(404, "Result " + duosmiumID + " does not exist!");
		}
	}
}) satisfies RequestHandler;