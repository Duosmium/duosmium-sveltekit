// noinspection JSUnusedGlobalSymbols

import type { RequestHandler } from './$types';
import { getAllSchools, handlePOSTedJSON, deleteAllSchools } from '$lib/schools/async';
import { exportYAMLOrJSON } from '$lib/results/helpers';
import { error } from '@sveltejs/kit';

export const GET = (async ({ url }) => {
	const allSchools = await getAllSchools();
	return exportYAMLOrJSON(url, allSchools, 'schools');
}) satisfies RequestHandler;

export const POST = (async ({ request }) => {
	const data = await request.formData();
	const json = data.get('school');
	let schoolName;
	if (json !== null && typeof json === 'object') {
		schoolName = await handlePOSTedJSON(json);
	}
	return new Response(`School ${schoolName} created`, { status: 201 });
}) satisfies RequestHandler;

export const PUT = (async () => {
	throw error(501);
}) satisfies RequestHandler;

export const PATCH = (async () => {
	throw error(501);
}) satisfies RequestHandler;

export const DELETE = (async () => {
	await deleteAllSchools();
	return new Response(null, { status: 204 });
}) satisfies RequestHandler;
