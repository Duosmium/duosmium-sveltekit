import { getCurrentUser } from '$lib/auth/helpers';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function isAdmin(supabase: SupabaseClient) {
	const user = await getCurrentUser(supabase);
	if (user === undefined) {
		return false;
	} else {
		return user.email?.endsWith('duosmium.org');
	}
}
