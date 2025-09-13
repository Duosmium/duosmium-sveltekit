import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string) => {
	return param.match(/^[a-zA-Z0-9!@#$%^&*()]$/) !== null;
}) satisfies ParamMatcher;
