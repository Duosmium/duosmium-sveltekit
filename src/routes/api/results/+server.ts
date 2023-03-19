import { load } from 'js-yaml';
import { getAllResults, addResult, deleteAllResults } from '$lib/results/async';
import { exportYAMLOrJSON } from '$lib/results/helpers';
import { error } from '@sveltejs/kit';

export async function DELETE() {
	await deleteAllResults();
	return new Response(null, { status: 204 });
}

export async function GET(request: Request) {
	const allResults = await getAllResults();
	return exportYAMLOrJSON(new URL(request.url), allResults, 'results');
}

export async function PATCH() {
	throw error(405);
}

export async function POST(request: Request) {
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
	const fileName = await addResult(obj);
	return new Response(`Result ${fileName} created`, { status: 201 });
}

export async function PUT() {
	throw error(405);
}
