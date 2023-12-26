import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { formSchema } from './schema';
import type { SupabaseClient } from '@supabase/supabase-js';
import { setFlash } from 'sveltekit-flash-message/server';

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
		const supabase: SupabaseClient = event.locals.supabase;
		const { data, error } = await supabase.auth.signInWithPassword({
			email: form.data.email,
			password: form.data.password
		});
		if (error) {
			setFlash(
				{
					type: 'error',
					message: error.message
				},
				event
			);
		} else {
			const firstName = data.user?.user_metadata.first_name;
			const lastName = data.user?.user_metadata.first_name;
			let message = 'Successfully logged in!';
			if (firstName && lastName) {
				message += ' Hello, ';
				message += firstName;
				message += lastName;
			}
			setFlash(
				{
					type: 'success',
					message: message
				},
				event
			);
			redirect(303, nextURL);
		}
	}
};
