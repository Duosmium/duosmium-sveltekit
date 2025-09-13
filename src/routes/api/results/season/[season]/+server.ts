import redis from '$lib/helpers/redis';
import { error as svelteError, json } from '@sveltejs/kit';

export async function GET({ params, locals: { supabase, user } }) {
	if (!params.season) {
		return svelteError(400, { message: 'Season parameter is required' });
	}
	let redisKey = `results:season:${params.season}`;
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
			.select('duosmium_id, title, date_string, location, official, preliminary')
			.eq('season', params.season)
			.order('duosmium_id', { ascending: false });
		if (error) {
			return svelteError(500, { message: error.message });
		}
		await redis.json.set(redisKey, '$', data);
		return json(data);
	}
}
