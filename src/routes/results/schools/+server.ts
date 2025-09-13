import { redirect } from '@sveltejs/kit';

export async function GET({ fetch }) {
	const letters = Object.keys(await (await fetch(`/api/schools`)).json());
	if (letters.length === 0) {
		return redirect(302, '/results');
	} else {
		return redirect(302, `/results/schools/${letters[0].toLowerCase()}`);
	}
}
