import { getRecentResults } from '$lib/results/async';
import { json } from '@sveltejs/kit';

export async function GET({params}) {
	const output = await getRecentResults(false, Number(params.limit));
	return json(output);
}