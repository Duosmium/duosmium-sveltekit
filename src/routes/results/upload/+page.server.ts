import type { Actions } from './$types';
import { addResultFromYAMLFile } from '$lib/results/async';

export const actions = {
	default: async ({ request }) => {
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