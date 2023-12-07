import type { Actions } from './$types';
import { ResultsAddQueue } from '$lib/results/queue';
import { error } from '@sveltejs/kit';
import { addResultFromYAMLFile } from '$lib/results/async';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const allFiles = data.getAll('yaml');
		const q = ResultsAddQueue.getInstance();
		q.drain(function () {
			console.log('All results have been added!');
		});
		for (const file of allFiles) {
			if (file === null || typeof file === 'string') {
				throw error(400, 'Uploaded value is not a file!');
			}
			// q.push(file);
			await addResultFromYAMLFile(file);
		}
	}
} satisfies Actions;