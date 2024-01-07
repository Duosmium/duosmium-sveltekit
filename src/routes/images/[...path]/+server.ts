import type { RequestHandler } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }: { params: { path: string } }) => {
	const res = await fetch(`${PUBLIC_API_URL}/images/${params.path}`);
	if (!res.ok) {
		throw error(res.status, { message: res.statusText });
	}
	return new Response(await res.blob());
};
