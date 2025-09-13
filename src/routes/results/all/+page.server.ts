import type { PageServerLoad } from './$types';

async function getSeasons(
	fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>
) {
	const seasons: { [season: number]: any } = {};
	for (let i = new Date().getFullYear() + 1; i > 1985; i--) {
		const response = await fetch(`/api/results/season/${i.toString()}`);
		if (response.ok) {
			const data = await response.json();
			if (data.length === 0) continue; // Skip empty seasons
			seasons[i] = data;
		}
	}
	return seasons;
}

export const load: PageServerLoad = async ({ fetch }) => {
	const seasons = getSeasons(fetch);
	for (let i = new Date().getFullYear() + 1; i > 1985; i--) {
		const response = await fetch(`/api/results/season/${i.toString()}`);
		if (response.ok) {
			const data = await response.json();
			if (data.length === 0) continue; // Skip empty seasons
			seasons[i] = data;
		}
	}
	return { seasons };
};
