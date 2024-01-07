import type { SupabaseClient } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';
import { PUBLIC_API_URL } from '$env/static/public';

export async function isAdmin(jwt: string) {
	const apiCall = await fetch(`${PUBLIC_API_URL}/auth/admin`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${jwt}`
		}
	});
	if (apiCall.ok) {
		return (await apiCall.json()).admin;
	}
	return false;
}

export async function redirectToLoginIfNotLoggedIn(jwt: string | null, next: string) {
	if (jwt === null) {
		redirect(302, `/auth/login?next=${next}`);
	}
}

export async function redirectToHomeIfNotAdmin(jwt: string) {
	if (!(await isAdmin(jwt))) {
		redirect(302, '/');
	}
}
