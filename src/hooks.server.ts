import { PUBLIC_API_URL } from '$env/static/public';

export const handle = async ({ event, resolve }) => {
	const authCookie = event.cookies.get('duosmium-auth-token');
	if (authCookie) {
		try {
			let authJSON = JSON.parse(authCookie);
			if (Date.now() >= 1000 * authJSON.expires_at) {
				const refresh = await fetch(`${PUBLIC_API_URL}/auth/refresh`, {
					method: 'POST',
					body: authCookie,
					headers: {
						'Content-Type': 'application/json'
					}
				});
				authJSON = await refresh.json();
				event.cookies.set('duosmium-auth-token', JSON.stringify(authJSON), {
					httpOnly: true,
					secure: true,
					sameSite: 'strict',
					maxAge: 60 * 60 * 24,
					path: '/'
				});
			}
			event.locals.access_token = authJSON.access_token;
			event.locals.refresh_token = authJSON.refresh_token;
			event.locals.user = authJSON.user;
			event.locals.session = authJSON;
		} catch (error) {
			event.locals.access_token = undefined;
			event.locals.refresh_token = undefined;
			event.locals.user = undefined;
			event.locals.session = undefined;
		}
	}
	return await resolve(event);
};
