import { deleteAllEvents, getAllEvents } from '$lib/events/async';
import { exportYAMLOrJSON } from '$lib/results/helpers';
import { error } from '@sveltejs/kit';

export async function DELETE() {
	await deleteAllEvents();
	return new Response(null, { status: 204 });
}

export async function GET(request: Request) {
	const allEvents = await getAllEvents();
	return exportYAMLOrJSON(new URL(request.url), allEvents, 'events');
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
