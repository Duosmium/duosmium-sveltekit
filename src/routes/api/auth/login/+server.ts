import { json, error as svelteError, type RequestEvent } from '@sveltejs/kit';

export async function POST({ locals: { supabase }, request }: RequestEvent) {
	const { email, password } = await request.json();
	const { data, error } = await supabase.auth.signInWithPassword({ email, password });
	if (error) {
		return svelteError(401, { message: error.message });
	}
	return json(data);
}
