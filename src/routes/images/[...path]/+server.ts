import { supabase } from '$lib/global/supabase';
import { error } from '@sveltejs/kit';

export async function DELETE() {
	throw error(405);
}

export async function GET(request: Request) {
	const url = new URL(request.url);
	const imagePath = url.pathname.replace('/images/', '');
	const output = await supabase.storage.from('images').download(imagePath);
	if (output.error) {
		if (output.error.message === 'The resource was not found') {
			throw error(404, 'Image ' + url.pathname + ' could not be found!');
		}
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		throw error(output.error.status, output.error.message);
	} else {
		return new Response(output.data);
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
