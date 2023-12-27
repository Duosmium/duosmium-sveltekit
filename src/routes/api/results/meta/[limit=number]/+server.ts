import { getRecentResults } from '$lib/results/async';
import { json } from '@sveltejs/kit';

export async function GET({request, params}) {
	const ascending = new URL(request.url).searchParams.get("ascending");
	const ascBool = ascending === null ? false : ascending === "true";
	const output = await getRecentResults(ascBool, Number(params.limit));
	return json(output);
}