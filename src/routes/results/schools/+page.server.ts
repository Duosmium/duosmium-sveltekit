import type { PageServerLoad } from './$types';
import { getFirstLetter } from '$lib/teams/async';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const firstLetter = await getFirstLetter();
	if (firstLetter.length === 0) {
		error(404);
	}
	redirect(302, `/results/schools/${firstLetter}`);
};
