import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string) => {
	return (
		param.match(
			/^[0-9]{4}-[0-9]{2}-[0-9]{2}_\w*(invitational|regional|states|nationals)\w*_[abc]$/
		) !== null
	);
}) satisfies ParamMatcher;
