// noinspection JSUnusedGlobalSymbols

import type { RequestHandler } from './$types';
import { getAllResults, handlePOSTedJSON, deleteAllResults } from '$lib/results/async';
import { exportYAMLOrJSON } from '$lib/results/helpers';
import { error } from '@sveltejs/kit';
import { load } from 'js-yaml';

export const GET = (async ({ url }) => {
	const allResults = await getAllResults();
	return exportYAMLOrJSON(url, allResults, 'results');
}) satisfies RequestHandler;

export const POST = (async ({ request }) => {
	const body = request.body;
	if (body === null) {
		throw error(400, 'No data provided!');
	}
	let data = '';
	let readDone = false;
	const reader = body.getReader();
	while (!readDone) {
		await reader
			.read()
			.then(({ done, value }) => {
				if (value === undefined) {
					readDone = done;
				}
				if (!readDone) {
					const fragment = new TextDecoder().decode(value);
					data += fragment;
				}
			});
	}
	let obj;
	try {
		// Why on earth does this load to a string first and then an object???
		obj = load(<string>load(data));
	} catch (e) {
		obj = JSON.parse(data);
	}
	const fileName = await handlePOSTedJSON(obj);
	return new Response(`Result ${fileName} created`, { status: 201 });
}) satisfies RequestHandler;

export const PUT = (async () => {
	throw error(501);
}) satisfies RequestHandler;

export const PATCH = (async () => {
	throw error(501);
}) satisfies RequestHandler;

export const DELETE = (async () => {
	await deleteAllResults();
	return new Response(null, { status: 204 });
}) satisfies RequestHandler;
