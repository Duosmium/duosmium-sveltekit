import {
	deleteResult, getCompleteResult
} from '$lib/results/async';
import { exportYAMLOrJSON } from '$lib/results/helpers';
import { error } from '@sveltejs/kit';
import { isAdmin } from '$lib/auth/admin';

export async function DELETE({ params, locals: {supabase} }) {
	if (!(await isAdmin(supabase))) {
		throw error(403, 'You are not authorized to delete results!');
	}
	await deleteResult(params.id);
	return new Response(null, { status: 204 });
}

export async function GET({ request, params, locals: {supabase} }) {
	const result = await getCompleteResult(params.id);
	return exportYAMLOrJSON(new URL(request.url), result, params.id);
}
