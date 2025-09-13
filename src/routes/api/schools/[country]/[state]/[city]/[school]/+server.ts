import redis from '$lib/helpers/redis';
import { json, error as svelteError, type RequestEvent } from '@sveltejs/kit';

export async function GET({ locals: { supabase, user }, params }: RequestEvent) {
	let redisKey = `schools:${params.country}:${params.state}:${params.city}:${params.school}`;
	if (user !== null && user.app_metadata.admin) {
		redisKey += ':admin';
	}
	if (await redis.exists(redisKey)) {
		const cachedSchool = await redis.json.get(redisKey);
		if (cachedSchool) {
			return json(cachedSchool);
		}
	} else {
		const promise = supabase
			.from('schools')
			.select('id')
			.eq('country', params.country)
			.eq('name', params.school);
		if (params.state !== 'null') {
			promise.eq('state', params.state);
		} else {
			promise.is('state', null);
		}
		if (params.city !== 'null') {
			promise.eq('city', params.city);
		} else {
			promise.is('city', null);
		}
		const { data, error } = await promise;
		if (error) {
			return svelteError(500, { message: error.message });
		}
		if (data.length === 0) {
			return svelteError(404, { message: 'School not found' });
		}
		const { data: rankings, error: rankingsError } = await supabase
			.from('rankings')
			.select('results (title, duosmium_id), rank')
			.eq('school_id', data[0].id)
			.order('results (duosmium_id)', { ascending: false });
		if (rankingsError) {
			return svelteError(500, { message: rankingsError.message });
		}
		const output: { [key: string]: { title: string; ranks: number[] } } = {};
		for (const ranking of rankings) {
			if (!output[ranking.results.duosmium_id]) {
				output[ranking.results.duosmium_id] = { title: ranking.results.title, ranks: [] };
			}
			output[ranking.results.duosmium_id].ranks.push(ranking.rank);
		}
		for (const ranking of rankings) {
			output[ranking.results.duosmium_id].ranks.sort((a, b) => a - b);
		}
		await redis.json.set(redisKey, '$', { id: data[0].id, rankings: output });
		return json({ id: data[0].id, rankings: output });
	}
}
