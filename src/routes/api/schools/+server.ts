import { deleteAllSchools, getAllSchools } from '$lib/schools/async';
import { exportYAMLOrJSON } from '$lib/results/helpers';
import { error } from '@sveltejs/kit';

export async function DELETE() {
	await deleteAllSchools();
	return new Response(null, { status: 204 });
}

export async function GET(request: Request) {
	const allSchools = await getAllSchools();
	return exportYAMLOrJSON(new URL(request.url), allSchools, 'schools');
}

export async function PATCH() {
	throw error(405);
}

export async function POST() {
	throw error(405);
}

export async function PUT() {
	throw error(405);
}
