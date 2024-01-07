import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getAllFirstLetters, getTournamentsPerSchool } from '$lib/teams/async';
import { getFromAPI } from '$lib/global/api';

export const load: PageServerLoad = async ({ params }) => {
	const letter = params.letter.toLowerCase();
	const letters = await getFromAPI('/results/schools/letters');
	if (letters.indexOf(letter) === -1) {
		redirect(302, '/results/schools');
	}
	const tournamentNames = await getFromAPI('/results/titles');
	const allData = await getFromAPI(`/results/schools/letters/${letter}`);
	return {
		allData: allData,
		tournamentNames: tournamentNames,
		letters: letters
	};
};
