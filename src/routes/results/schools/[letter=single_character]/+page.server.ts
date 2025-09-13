import type { PageServerLoad } from './$types';

async function loadData(letter: string, fetch) {
	return await (await fetch(`/api/schools/letters/${letter}/all`)).json();
}

export const load: PageServerLoad = async ({ fetch, params }) => {
	const letters = Object.keys(await (await fetch(`/api/schools`)).json());
	return { letters, schools: loadData(params.letter, fetch) };
};
