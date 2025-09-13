import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const latestResultsData = await (await fetch(`/api/results/latest`)).json();
	const recentResultsData = await (await fetch(`/api/results/recent`)).json();
	const levelsData = await (await fetch(`/api/results/levels`)).json();

	return { latestResultsData, recentResultsData, levelsData };
};
