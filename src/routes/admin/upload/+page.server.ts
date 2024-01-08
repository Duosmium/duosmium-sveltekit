import type { Actions } from './$types';
import { load as loadYAML } from 'js-yaml';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { formSchema } from './schema';
import { fail, redirect } from '@sveltejs/kit';
import { redirectToHomeIfNotAdmin, redirectToLoginIfNotLoggedIn } from '$lib/auth/admin';
import { PUBLIC_API_URL } from '$env/static/public';

export const load: PageServerLoad = async ({ locals: { access_token } }) => {
	await redirectToLoginIfNotLoggedIn(access_token, '/admin/upload');
	await redirectToHomeIfNotAdmin(access_token);
	return {
		form: await superValidate(formSchema)
	};
};

export const actions = {
	default: async (event) => {
		const request = event.request;
		const data = await request.formData();
		const allFiles = data.getAll('yaml');
		for (const file of allFiles) {
			if (file === null || typeof file === 'string') {
				fail(400);
			}
			const yaml = await file.text();
			let obj;
			try {
				obj = loadYAML(yaml);
			} catch {
				fail(400);
			}
			const apiCall = await fetch(`${PUBLIC_API_URL}/results`, {
				method: 'POST',
				body: JSON.stringify(obj),
				headers: {
					Authorization: `Bearer ${event.locals.access_token}`,
					'Content-Type': 'application/json'
				}
			});
			if (!apiCall.ok) {
				fail(apiCall.status);
			}
		}
		redirect(303, request.url);
	}
} satisfies Actions;
