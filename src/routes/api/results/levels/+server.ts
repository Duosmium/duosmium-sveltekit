import { TOURNAMENT_LEVELS } from '$lib/helpers/misc';
import redis from '$lib/helpers/redis';
import { json, error as svelteError, type RequestEvent } from '@sveltejs/kit';

export async function GET({ locals: { supabase, user } }: RequestEvent) {
	let redisKey = 'results:levels';
	if (user !== null && user.app_metadata.admin) {
		redisKey += ':admin';
	}
	if (await redis.exists(redisKey)) {
		const cachedLevels = await redis.json.get(redisKey);
		if (cachedLevels) {
			return json(cachedLevels);
		}
	} else {
		const output: { [key: string]: number } = {};
		for (const level of Object.keys(TOURNAMENT_LEVELS)) {
			const { count, error: levelError } = await supabase
				.from('results')
				.select('*', { count: 'exact', head: true })
				.eq('level', level);
			if (levelError) {
				return svelteError(500, { message: levelError.message });
			}
			output[level] = count ?? 0;
		}
		output.total = Object.values(output).reduce((a, b) => a + b, 0);
		await redis.json.set(redisKey, '$', output);
		return json(output);
	}
}
