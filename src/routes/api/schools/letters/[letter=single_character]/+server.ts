import redis from '$lib/helpers/redis.js';
import { error as svelteError, json } from '@sveltejs/kit';

export async function GET({ locals: { supabase, user }, params }) {
	let redisKey = `schools:letters:${params.letter}`;
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
			.select('name, city, state, country')
			.ilike('name', `${params.letter.toLowerCase()}%`)
			.order('name', { ascending: true })
			.order('city', { ascending: true })
			.order('state', { ascending: true })
			.order('country', { ascending: true });
		if (error) {
			return svelteError(500);
		}
		await redis.json.set(redisKey, '$', data);
		return json(data);
	}
}
