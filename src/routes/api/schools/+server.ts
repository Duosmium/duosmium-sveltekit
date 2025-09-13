import redis from '$lib/helpers/redis';
import { json, error as svelteError, type RequestEvent } from '@sveltejs/kit';

export async function GET({ locals: { supabase, user } }: RequestEvent) {
	let redisKey = 'schools:all';
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
			.select('id, name')
			.order('name', { ascending: true });
		if (error) {
			return svelteError(500, { message: error.message });
		}
		const output: { [key: string]: number } = {};
		for (const school of data) {
			if (!school.name || typeof school.name !== 'string') {
				continue; // Skip if name is not a string
			}
			const firstLetter = school.name[0].toUpperCase();
			output[firstLetter] = (output[firstLetter] || 0) + 1;
		}
		await redis.json.set(redisKey, '$', output);
		return json(output);
	}
}
