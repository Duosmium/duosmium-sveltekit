import { load } from 'js-yaml';
import {
	addResult,
	createResultDataInput,
	deleteAllResults,
	getAllCompleteResults
} from '$lib/results/async';
import { exportYAMLOrJSON } from '$lib/results/helpers';
import { getInterpreter } from '$lib/results/interpreter';
import { error, json } from '@sveltejs/kit';
import { isAdmin } from '$lib/auth/admin';

export async function DELETE({ locals: { supabase } }) {
	if (!(await isAdmin(supabase))) {
		throw error(403, 'You are not authorized to delete results!');
	}
	await deleteAllResults();
	return new Response(null, { status: 204 });
}

export async function GET({ request }) {
	const allResults = await getAllCompleteResults();
	return exportYAMLOrJSON(new URL(request.url), allResults, 'results');
}

export async function PATCH() {
	return new Response(null, { status: 405, headers: { Allow: 'DELETE, GET, POST' } });
}

export async function POST({ request, locals: { supabase } }) {
	if (!(await isAdmin(supabase))) {
		throw error(403, 'You are not authorized to add results!');
	}
	const body = request.body;
	if (body === null) {
		throw error(400, 'No data provided!');
	}
	let data = '';
	let readDone = false;
	const reader = body.getReader();
	while (!readDone) {
		await reader.read().then(({ done, value }) => {
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
	const interpreter = await getInterpreter(obj);
	const result = await addResult(await createResultDataInput(interpreter));
	return json(result, { status: 201 });
}

export async function PUT() {
	return new Response(null, { status: 405, headers: { Allow: 'DELETE, GET, POST' } });
}
