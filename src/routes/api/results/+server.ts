// noinspection JSUnusedGlobalSymbols

import type { RequestHandler } from './$types';
import { getAllResults } from '$lib/async';
import { JSON_OPTIONS, objectToJSON, YAML_OPTIONS, objectToYAML } from '$lib/helpers';

export const GET = (async ({ url }) => {
	const allResults = await getAllResults();
	if (url.searchParams.get("format") === 'yaml') {
		const myYAMLOptions = YAML_OPTIONS;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		myYAMLOptions["headers"]["content-disposition"] = "attachment; filename=results.yaml";
		return new Response(objectToYAML(allResults), myYAMLOptions);
	} else {
		return new Response(objectToJSON(allResults), JSON_OPTIONS);
	}
}) satisfies RequestHandler;