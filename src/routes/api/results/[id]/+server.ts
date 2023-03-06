// noinspection JSUnusedGlobalSymbols

import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	getResultByDuosmiumID,
	getResultByMongoID,
	deleteResultByDuosmiumID,
	deleteResultByMongoID
} from '$lib/results/async';
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

export const POST = (async () => {
	throw error(501);
}) satisfies RequestHandler;

export const PUT = (async () => {
	throw error(501);
}) satisfies RequestHandler;

export const PATCH = (async () => {
	throw error(501);
}) satisfies RequestHandler;

export const DELETE = (async ({ url }) => {
	const duosmiumID = url.pathname.split('/').pop();
	if (duosmiumID === undefined) {
		throw error(400, 'No result specified!');
	} else if (MONGO_ID_REGEX.test(duosmiumID)) {
		try {
			await deleteResultByMongoID(new ObjectId(duosmiumID));
		} catch (e) {
			throw error(404, 'Result ' + duosmiumID + ' does not exist!');
		}
	} else {
		try {
			await deleteResultByDuosmiumID(duosmiumID);
		} catch (e) {
			throw error(404, 'Result ' + duosmiumID + ' does not exist!');
		}
	}
	return new Response(null, { status: 204 });
}) satisfies RequestHandler;
