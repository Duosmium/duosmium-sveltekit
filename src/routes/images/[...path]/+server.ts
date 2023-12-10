import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { SupabaseClient } from '@supabase/supabase-js';

export const GET: RequestHandler = async ({
	params,
	locals: { supabase }
}: {
	params: { path: string };
	locals: { supabase: SupabaseClient };
}) => {
	const output = await supabase.storage.from('images').download(params.path);
	if (output.error) {
		if (output.error.message === 'Object not found') {
			throw error(404, { message: `Image /images/${params.path} could not be found!` });
		} else {
			throw error(output.error.status, { message: output.error.message });
		}
	} else {
		return new Response(output.data);
	}
};
