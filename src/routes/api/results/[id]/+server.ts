import { deleteResult, getResult } from '$lib/results/async';
import { exportYAMLOrJSON } from '$lib/results/helpers';
import { error } from '@sveltejs/kit';

export async function DELETE(request: Request) {
	const url = new URL(request.url);
	const duosmiumID = url.pathname.split('/').pop();
	if (duosmiumID === undefined) {
		return new Response('No result specified!', { status: 400 });
	} else {
		try {
			await deleteResult(duosmiumID);
		} catch (e) {
			return new Response('Result ' + duosmiumID + ' does not exist!', { status: 404 });
		}
	}
	return new Response(null, { status: 204 });
}

export async function GET(request: Request) {
	const url = new URL(request.url);
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
}

export async function PATCH() {
	throw error(501);
}

export async function POST() {
	throw error(501);
}

export async function PUT() {
	throw error(501);
}
