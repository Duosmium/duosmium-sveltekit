import type { Actions } from './$types';
import { ResultsAddQueue } from '$lib/results/queue';

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
				throw new Error('Uploaded value is not a file!');
			}
			q.push(file);
			// addResultFromYAMLFile(file);
		}
	}
} satisfies Actions;
