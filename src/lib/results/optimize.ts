import { supabase } from '$lib/global/supabase';
import { getInterpreter } from '$lib/results/interpreter';
import { generateFilename } from '$lib/results/helpers';
import { createLogoPath } from '$lib/results/logo';
import { createBgColorFromImagePath } from '$lib/results/color';
import { addResult, createCompleteResultDataInput } from '$lib/results/async';

export async function addManyYAMLs(yamls: string[]) {
	const imageNames = (
		await supabase.storage.from('images').list('logos', { limit: 1048576 })
	).data?.map((img) => img.name);
	const resultDataInputs = [];
	const times = new Map();
	for (let i = 0; i < yamls.length; i++) {
		const interpreter = getInterpreter(yamls[i]);
		const duosmiumID = generateFilename(interpreter);
		const logo = await createLogoPath(duosmiumID, imageNames);
		times.set(duosmiumID, Date.now());
		const prom = createCompleteResultDataInput(interpreter, logo).then((res) => {
			const newTime = Date.now();
			console.log(
				`Generated data for ${res.duosmium_id} in ${newTime - times.get(res.duosmium_id)} ms`
			);
			times.set(res.duosmium_id, newTime);
			return res;
		});
		resultDataInputs.push(prom);
	}
	const inputs = await Promise.all(resultDataInputs);
	for (let i = 0; i < inputs.length; i++) {
		const input = inputs[i];
		await addResult(input);
		console.log(
			`Added data for ${input.duosmium_id} in ${Date.now() - times.get(input.duosmium_id)} ms`
		);
	}
}
