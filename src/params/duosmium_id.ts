import type { ParamMatcher } from '@sveltejs/kit';
import { DUOSMIUM_ID_REGEX } from '$lib/helpers';

export const match = ((param) => {
	return DUOSMIUM_ID_REGEX.test(param);
}) satisfies ParamMatcher;
