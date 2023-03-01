// noinspection JSUnusedGlobalSymbols

import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getResult } from '$lib/async';
import { exportYAMLOrJSON } from '$lib/helpers';

export const GET = (async ({ url }) => {
	const duosmiumID = url.pathname.split('/').pop();
	if (duosmiumID === undefined) {
		throw error(400, 'No result specified!');
	} else {
		try {
			const result = await getResult(duosmiumID);
			return exportYAMLOrJSON(url, result, duosmiumID);
		} catch (e) {
			throw error(404, 'Result ' + duosmiumID + ' does not exist!');
		}
	}
}) satisfies RequestHandler;
