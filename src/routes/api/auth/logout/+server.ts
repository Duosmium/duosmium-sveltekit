import { json, error as svelteError, type RequestEvent } from '@sveltejs/kit';

export async function POST({ locals: { supabase } }: RequestEvent) {
	const { error } = await supabase.auth.signOut();
	if (error) {
		return svelteError(500, { message: error.message });
	}
	return json({ message: 'Logged out' });
}
