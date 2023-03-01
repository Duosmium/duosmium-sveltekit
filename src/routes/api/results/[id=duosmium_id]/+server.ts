// noinspection JSUnusedGlobalSymbols

import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getResult } from '$lib/async';
import { JSON_OPTIONS, objectToJSON, YAML_OPTIONS, objectToYAML } from '$lib/helpers';

export const GET = (async ({ url }) => {
	const duosmiumID = url.pathname.split("/").pop();
	if (duosmiumID === undefined) {
		throw error(400, "No result specified!");
	} else {
		try {
			const result = await getResult(duosmiumID)
			if (url.searchParams.get("format") === 'yaml') {
				const myYAMLOptions = YAML_OPTIONS;
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				myYAMLOptions["headers"]["content-disposition"] = `attachment; filename=${duosmiumID}.yaml`;
				return new Response(objectToYAML(result), myYAMLOptions);
			} else {
				return new Response(objectToJSON(result), JSON_OPTIONS);
			}
		}	catch (e) {
			throw error(404, "Result " + duosmiumID + " does not exist!");
		}
	}
}) satisfies RequestHandler;