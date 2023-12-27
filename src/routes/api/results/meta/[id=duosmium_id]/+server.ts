import {
	getResult
} from '$lib/results/async';
import { exportYAMLOrJSON } from '$lib/results/helpers';

export async function GET({ request, params }) {
	const result = await getResult(params.id);
	return exportYAMLOrJSON(new URL(request.url), result, params.id + "_meta");
}