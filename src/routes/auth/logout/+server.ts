import { fail, redirect } from '@sveltejs/kit';
import { PUBLIC_API_URL } from '$env/static/public';

export const GET = async (event) => {
	const {
		url,
		locals: { access_token },
		cookies
	} = event;
	const next = url.searchParams.get('next') ?? '/';
	if (access_token == undefined) {
		fail(401);
	}
	const apiCall = await fetch(`${PUBLIC_API_URL}/auth/logout`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${event.locals.access_token}`
		}
	});
	if (!apiCall.ok) {
		fail(apiCall.status);
	}
	cookies.delete('duosmium-auth-token', { path: '/' });
	redirect(302, next);
};
