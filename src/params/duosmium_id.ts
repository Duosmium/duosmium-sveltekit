import type { ParamMatcher } from '@sveltejs/kit';
import { DUOSMIUM_ID_REGEX } from '$lib/global/helpers';

export const match: ParamMatcher = (param) => {
	return DUOSMIUM_ID_REGEX.test(param);
};
