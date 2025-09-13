import redis from '$lib/helpers/redis';
import { json, error as svelteError, type RequestEvent } from '@sveltejs/kit';

export async function GET({ locals: { supabase, user } }: RequestEvent) {
	let redisKey = 'results:recent';
	if (user !== null && user.app_metadata.admin) {
		redisKey += ':admin';
	}
	if (await redis.exists(redisKey)) {
		const cachedResults = await redis.json.get(redisKey);
		if (cachedResults) {
			return json(cachedResults);
		}
	} else {
		const { data, error } = await supabase
			.from('results')
			.select('duosmium_id, title, short_title, level, location, date_string, logo')
			.order('duosmium_id', { ascending: false })
			.limit(24);
		if (error) {
			return svelteError(500, { message: error.message });
		}
		await redis.json.set(redisKey, '$', data);
		return json(data);
	}
}
