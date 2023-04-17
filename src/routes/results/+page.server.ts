import { prisma } from '$lib/global/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		allResults: await prisma.result.findMany({
			orderBy: {
				duosmiumId: 'desc'
			}
		})
	};
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
}) satisfies PageServerLoad;
