import type { PageServerLoad } from './$types';
import { getCompleteResult } from '$lib/results/async';
import { findBgColor } from '$lib/results/helpers';

export const load = (async ({ params }) => {
	const fullData = await getCompleteResult(params.id);
	const color = await findBgColor(params.id);
	return {
		result: fullData,
		color: color
	};
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
}) satisfies PageServerLoad;
