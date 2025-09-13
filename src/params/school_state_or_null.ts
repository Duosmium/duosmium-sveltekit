import { SCHOOL_STATES } from '$lib/helpers/misc';
import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string) => {
	return Object.keys(SCHOOL_STATES).includes(param) || param === 'null';
}) satisfies ParamMatcher;
