import { getEvent } from '$lib/events/async';
import { exportYAMLOrJSON } from '$lib/results/helpers';
import { error } from '@sveltejs/kit';

export async function DELETE() {
	throw error(405);
}

export async function GET(request: Request) {
	const url = new URL(request.url);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const eventID = decodeURI(url.pathname.split('/').pop());
	if (eventID === undefined) {
		throw error(400, 'No event specified!');
	} else {
		try {
			const event = await getEvent(eventID);
			return exportYAMLOrJSON(url, event, eventID);
		} catch (e) {
			throw error(404, 'Event ' + eventID + ' does not exist!');
		}
	}
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
