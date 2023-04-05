import { queue } from "async";
import type { Actions } from './$types';
import { addResultFromYAMLFile } from '$lib/results/async';

export const actions = {
	default: async ({ request }) => {
		// await deleteAllResults();
		// await deleteAllLocations();
		// await deleteAllEvents();
		const data = await request.formData();
		const allFiles = data.getAll('yaml');
		const q = queue(addResultFromYAMLFile, 64);
		for (const file of allFiles) {
			if (file === null || typeof file === 'string') {
				throw new Error('Uploaded value is not a file!');
			}
			// TODO: look into https://stackoverflow.com/questions/9539886/limiting-asynchronous-calls-in-node-js
			// documentation: https://caolan.github.io/async/v3/
			// await addResultFromYAMLFile(file);
			q.push(file);
			console.log(`Pushed ${file.name}!`)
		}
	}
} satisfies Actions;
