import type { Actions } from './$types';
import { error } from '@sveltejs/kit';
import {
	addResult,
	createCompleteResultDataInput
} from '$lib/results/async';
import { load as loadYAML } from 'js-yaml';
import Interpreter from 'sciolyff/interpreter';
import { getInterpreter } from '$lib/results/interpreter';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { formSchema } from './schema';

export const load: PageServerLoad = () => {
	return {
		form: superValidate(formSchema)
	};
};


export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const allFiles = data.getAll('yaml');
		// const q = ResultsAddQueue.getInstance();
		// q.drain(function () {
		// 	console.log('All results have been added!');
		// });
		const generating_input = [];
		for (const file of allFiles) {
			if (file === null || typeof file === 'string') {
				throw error(400, 'Uploaded value is not a file!');
			}
			// q.push(file);
			// await addResultFromYAMLFile(file);
			const yaml = await file.text();
			const obj = loadYAML(yaml);
			const interpreter: Interpreter = getInterpreter(obj);
			generating_input.push(createCompleteResultDataInput(interpreter));
		}
		const inputs = await Promise.all(generating_input);
		for (const input of inputs) {
			await addResult(input);
		}
	}
} satisfies Actions;
