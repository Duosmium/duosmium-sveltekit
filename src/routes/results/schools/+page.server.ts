import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const letters = Object.keys(await (await fetch(`/api/schools`)).json());
	if (letters.length === 0) {
		return redirect(302, '/results');
	}
	return redirect(302, `/results/schools/${letters[0].toLowerCase()}`); // Redirect to the first letter's page
};
