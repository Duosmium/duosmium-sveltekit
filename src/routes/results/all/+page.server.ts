import type { PageServerLoad } from './$types';
import { db } from '$lib/database';

export const load = (async () => {
	return {
		allResults: await db.collection('results').find().toArray()
	};
}) satisfies PageServerLoad;