import type { PageServerLoad } from './$types';
import { getFirstLetter } from '$lib/teams/async';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const firstLetter = await getFirstLetter();
	if (firstLetter.length === 0) {
		throw error(404);
	}
	throw redirect(302, `/results/schools/${firstLetter}`);
};
