import type { PageServerLoad } from './$types';
import { getCompleteResult, getResult } from '$lib/lib/results/async';

export const load = (async ({ params }) => {
	const fullData = await getCompleteResult(params.id);
	const color = (await getResult(params.id)).color ?? '#1f1b35';
	return {
		result: fullData,
		color: color
	};
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
}) satisfies PageServerLoad;
