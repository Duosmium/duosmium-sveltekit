import { supabase } from '$lib/global/supabase';
import { getInterpreter } from "$lib/results/interpreter";
import { generateFilename } from "$lib/results/helpers";
import { createLogoPath } from "$lib/results/logo";
import { createBgColorFromImagePath } from "$lib/results/color";
import { addResult, createCompleteResultDataInput } from "$lib/results/async";

export async function addManyYAMLs(yamls: string[]) {
  const imageNames = (
    await supabase.storage.from('images').list('logos', { limit: 1048576 })
  ).data?.map((img) => img.name);
  const resultDataInputs = [];
  const colorMap: Map<string, string> = new Map<string, string>();
  for (let i = 0; i < yamls.length; i++) {
    const interpreter = getInterpreter(yamls[i]);
    const duosmiumID = generateFilename(interpreter);
    const logo = await createLogoPath(duosmiumID, imageNames);
    let color: string;
    if (colorMap.has(logo)) {
      color = colorMap.get(logo);
    } else {
      color = await createBgColorFromImagePath(logo);
      colorMap.set(logo, color);
    }
    const prom = createCompleteResultDataInput(interpreter, logo, color).then(res => {resultDataInputs.splice(resultDataInputs.indexOf(prom), 1); return res;});
    resultDataInputs.push(prom);
  }
  const inputs = await Promise.all(resultDataInputs);
  for (const input of inputs) {
    await addResult(input);
  }
}