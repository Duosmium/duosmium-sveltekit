import type { PageServerLoad } from './$types';
import { getAllResults } from "$lib/results/async";

export const load: PageServerLoad = async () => {
  const allResults = await getAllResults(false);
  const seasons: number[] = [];
  const resultsBySeason = {};
  for (const result of allResults) {
    const resultSeason = Number(result.full_title.split(' ')[0]);
    if (seasons.length === 0 || seasons[seasons.length - 1] !== resultSeason) {
      seasons.push(resultSeason);
      // @ts-ignore
      resultsBySeason[resultSeason] = [];
    }
    // @ts-ignore
    resultsBySeason[resultSeason].push(result);
  }
  return {
    seasons: seasons,
    resultsBySeason: resultsBySeason
  }
};
