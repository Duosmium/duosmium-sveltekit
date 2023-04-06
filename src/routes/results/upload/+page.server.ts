import type { Actions } from './$types';
import { ResultsAddQueue } from "$lib/results/queue";

export const actions = {
	default: async ({ request }) => {
		// await deleteAllResults();
		// await deleteAllLocations();
		// await deleteAllEvents();
		const data = await request.formData();
		const allFiles = data.getAll('yaml');
		// pretty arbitrary value
		const q = ResultsAddQueue.getInstance();
		q.drain(function() {
			console.log('All results have been added!');
		})
		for (const file of allFiles) {
			if (file === null || typeof file === 'string') {
				throw new Error('Uploaded value is not a file!');
			}
			q.push(file);
		}
		while (q.started() && !q.idle()) {
			console.log(`Processes running: ${q.running()}, queue length: ${q.length()}`);
			await new Promise(r => setTimeout(r, 1000));
		}
	}
} satisfies Actions;
