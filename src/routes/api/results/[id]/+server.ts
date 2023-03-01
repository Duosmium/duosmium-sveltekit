// noinspection JSUnusedGlobalSymbols

import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getResultByDuosmiumID, getResultByMongoID } from '$lib/results/async';
import { MONGO_ID_REGEX, exportYAMLOrJSON } from '$lib/results/helpers';
import { ObjectId } from 'mongodb';

export const GET = (async ({ url }) => {
	const duosmiumID = url.pathname.split('/').pop();
	if (duosmiumID === undefined) {
		throw error(400, 'No result specified!');
	} else if (MONGO_ID_REGEX.test(duosmiumID)) {
		try {
			const result = await getResultByMongoID(new ObjectId(duosmiumID));
			return exportYAMLOrJSON(url, result, duosmiumID);
		} catch (e) {
			throw error(404, 'Result ' + duosmiumID + ' does not exist!');
		}
	} else {
		try {
			const result = await getResultByDuosmiumID(duosmiumID);
			return exportYAMLOrJSON(url, result, duosmiumID);
		} catch (e) {
			throw error(404, 'Result ' + duosmiumID + ' does not exist!');
		}
	}
}) satisfies RequestHandler;
