import { PUBLIC_API_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';

export async function getFromAPI(path: string) {
	const res = await fetch(`${PUBLIC_API_URL}${path}`);
	if (!res.ok) {
		throw error(res.status, { message: res.statusText });
	}
	return await res.json();
}
