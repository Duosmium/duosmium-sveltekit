import type { Actions } from './$types';
import { addResultFromYAMLFile } from '$lib/results/async';
import { deleteAllResults } from '../../../lib/results/async';
import { deleteAllEvents } from '../../../lib/events/async';
import { deleteAllLocations } from '../../../lib/locations/async';

export const actions = {
	default: async ({ request }) => {
		// await deleteAllResults();
		// await deleteAllLocations();
		// await deleteAllEvents();
		const data = await request.formData();
		const allFiles = data.getAll('yaml');
		allFiles.forEach((file) => {
			if (file === null || typeof file === 'string') {
				throw new Error('Uploaded value is not a file!');
			}
			addResultFromYAMLFile(file);
		});
	}
} satisfies Actions;
