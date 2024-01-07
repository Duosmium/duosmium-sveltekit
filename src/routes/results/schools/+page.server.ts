import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { getFromAPI } from '$lib/global/api';

export const load: PageServerLoad = async () => {
	const allLetters = await (await getFromAPI('/results/schools/letters')).json();
	if (allLetters.length === 0) {
		error(404);
	}
	redirect(302, `/results/schools/${allLetters[0]}`);
};
