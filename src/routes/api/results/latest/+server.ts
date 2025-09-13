import redis from '$lib/helpers/redis';
import { json, error as svelteError, type RequestEvent } from '@sveltejs/kit';

export async function GET({ locals: { supabase, user } }: RequestEvent) {
	let redisKey = 'results:latest';
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
			.select('duosmium_id, short_title')
			.order('created_at', { ascending: false })
			.limit(5);
		if (error) {
			return svelteError(500, { message: error.message });
		}
		await redis.json.set(redisKey, '$', data);
		return json(data);
	}
}
