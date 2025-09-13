import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const result = await fetch(`/api/results/${params.id}`);
	const resultData = await result.json();

	return { resultData };
};
