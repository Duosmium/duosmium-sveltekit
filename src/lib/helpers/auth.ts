import { error as svelteError } from '@sveltejs/kit';
import type { User } from '@supabase/supabase-js';

export async function apiCheckAdmin(user: User | null) {
	if (user) {
		if (!user.app_metadata.admin) {
			svelteError(403, { message: 'Forbidden' });
		}
	} else {
		svelteError(401, { message: 'Unauthorized' });
	}
}
