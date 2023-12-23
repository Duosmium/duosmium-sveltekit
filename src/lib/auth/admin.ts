import { getCurrentUser } from '$lib/auth/helpers';
import type { SupabaseClient } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';

export async function isAdmin(supabase: SupabaseClient) {
	const user = await getCurrentUser(supabase);
	if (user === undefined) {
		return false;
	} else {
		return user.user_metadata.admin === true;
	}
}

export async function redirectToLoginIfNotAdmin(supabase: SupabaseClient, next: string) {
	if (!(await isAdmin(supabase))) {
		throw redirect(302, `/auth/login?next=${next}`);
	}
}
