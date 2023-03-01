import { getResult } from '$lib/async';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export async function get({ params }) {
	return {
		status: 200,
		headers: {
			'Content-type': 'text/yaml',
			'Content-Disposition': 'attachment; filename=' + params.slug + '.yaml'
		},
		body: await getResult(params.slug.replace('.yaml', ''))
	};
}
