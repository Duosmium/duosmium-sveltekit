import type { PageServerLoad } from './$types';
import { getCompleteResult } from "../../../lib/results/async";

export const load = (async ({ params }) => {
  return {
    result: await getCompleteResult(params.id)
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
}) satisfies PageServerLoad;