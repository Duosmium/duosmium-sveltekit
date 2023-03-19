import { getSchool } from '$lib/schools/async';
import { exportYAMLOrJSON } from '$lib/results/helpers';
import { error } from '@sveltejs/kit';

export async function DELETE() {
	throw error(405);
}

export async function GET(request: Request) {
	const url = new URL(request.url);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const schoolID = decodeURI(url.pathname.split('/').pop());
	if (schoolID === undefined) {
		throw error(400, 'No school specified!');
	} else {
		try {
			const school = await getSchool(schoolID);
			return exportYAMLOrJSON(url, school, schoolID);
		} catch (e) {
			throw error(404, 'School ' + schoolID + ' does not exist!');
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
