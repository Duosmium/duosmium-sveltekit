import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { formSchema } from './schema';
import { PUBLIC_API_URL } from '$env/static/public';

export const load: PageServerLoad = () => {
	return {
		form: superValidate(formSchema)
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, formSchema);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		const nextURL = event.url.searchParams.get('next') ?? '/';
		const creds = JSON.stringify({
			email: form.data.email,
			password: form.data.password
		});
		const apiCall = await fetch(`${PUBLIC_API_URL}/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: creds
		});
		if (apiCall.ok) {
			const session = await apiCall.json();
			const sessionString = JSON.stringify(session);
			event.cookies.set('duosmium-auth-token', sessionString, {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				maxAge: 60 * 60 * 24,
				path: '/'
			});
			redirect(303, nextURL);
		}
	}
};
