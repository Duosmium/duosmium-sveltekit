import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getAllFirstLetters, getTournamentsPerSchool } from '$lib/teams/async';

export const load: PageServerLoad = async ({ params }) => {
	const letter = params.letter.toLowerCase();
	if (letter.length !== 1) {
		throw redirect(302, '/results/schools');
	}
	const [allData, tournamentNames] = await getTournamentsPerSchool(letter);
	if (allData.size == 0) {
		redirect(302, '/results/schools');
	}
	const letters = await getAllFirstLetters();
	return {
		allData: allData,
		tournamentNames: tournamentNames,
		letters: letters
	};
};
