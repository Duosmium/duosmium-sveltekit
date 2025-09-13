import redis from '$lib/helpers/redis';
import { json, error as svelteError, type RequestEvent } from '@sveltejs/kit';

export async function GET({ locals: { supabase, user }, params }: RequestEvent) {
	let redisKey = `schools:${params.country}:${params.state}`;
	if (user !== null && user.app_metadata.admin) {
		redisKey += ':admin';
	}
	if (await redis.exists(redisKey)) {
		const cachedSchools = await redis.json.get(redisKey);
		if (cachedSchools) {
			return json(cachedSchools);
		}
	} else {
		const { data, error } = await supabase
			.from('schools')
			.select('*')
			.eq('country', 'United States')
			.eq('state', params.state)
			.order('name', { ascending: true });
		if (error) {
			return svelteError(500, { message: error.message });
		}
		await redis.json.set(redisKey, '$', data);
		return json(data);
	}
}
