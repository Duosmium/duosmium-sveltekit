import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param) => {
	return /(19|20)\d{2}-[01]\d-[0-3]\d_([\w-]+_invitational|([ns]?[A-Z]{2})_[\w-]+_regional|([ns]?[A-Z]{2})_states|nationals)_[abc]/.test(
		param
	);
}) satisfies ParamMatcher;
