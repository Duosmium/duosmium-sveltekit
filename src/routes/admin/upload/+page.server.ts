import type { Actions } from './$types';
import { addResult, createCompleteResultDataInput } from '$lib/results/async';
import { load as loadYAML } from 'js-yaml';
import Interpreter from 'sciolyff/interpreter';
import { getInterpreter } from '$lib/results/interpreter';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { formSchema } from './schema';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { fail } from '@sveltejs/kit';
import { redirectToLoginIfNotAdmin } from '$lib/auth/admin';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	await redirectToLoginIfNotAdmin(supabase, '/admin/upload');
	return {
		form: superValidate(formSchema)
	};
};

export const actions = {
	default: async (event) => {
		const request = event.request;
		const data = await request.formData();
		const allFiles = data.getAll('yaml');
		setFlash(
			{
				type: 'success',
				message: `Uploaded ${allFiles.length} file${
					allFiles.length === 1 ? '' : 's'
				}! Please be patient as the results are imported.`
			},
			event
		);
		// const q = ResultsAddQueue.getInstance();
		// q.drain(function () {
		// 	console.log('All results have been added!');
		// });
		const generating_input = [];
		for (const file of allFiles) {
			if (file === null || typeof file === 'string') {
				setFlash({ type: 'error', message: 'Uploaded value is not a file!' }, event);
				fail(400);
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
		throw redirect(
			{
				type: 'success',
				message: `Imported ${inputs.length} result${inputs.length === 1 ? '' : 's'}!`
			},
			event
		);
	}
} satisfies Actions;
