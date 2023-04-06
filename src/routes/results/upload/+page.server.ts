import type { Actions } from './$types';
import { ResultsAddQueue } from "$lib/results/queue";
// import { deleteAllLocations } from "../../../lib/locations/async";
// import { deleteAllResults } from "../../../lib/results/async";
// import { deleteAllEvents } from "../../../lib/events/async";

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
	}
} satisfies Actions;
