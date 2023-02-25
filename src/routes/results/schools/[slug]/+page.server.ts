import type { PageServerLoad } from './$types';

export const load = (({ params }) => {
	return {
		slug: params.slug
	};
}) satisfies PageServerLoad;
