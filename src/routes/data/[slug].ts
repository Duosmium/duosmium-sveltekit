import { getResult, objectToYAML } from '../../lib/helpers';
import { error } from '@sveltejs/kit';

async function getResultWrapper(duosmiumID: string) {
	let result;
	try {
		result = await getResult(duosmiumID.replace(".yaml", ""))
	} catch (e) {
		throw error(404, "Result not found!")
	}
	return result
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export async function get({ params }) {
	return {
		status: 200,
		headers: {
			"Content-type" : "text/yaml",
			"Content-Disposition": "attachment; filename="+params.slug+".yaml"
		},
		body: getResultWrapper(params.slug).then(objectToYAML)
	}
}