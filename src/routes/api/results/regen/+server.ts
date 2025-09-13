import { addResultToQueue } from '$lib/helpers/queue';
import redis from '$lib/helpers/redis';
import {
	generateFilename,
	tournamentTitle,
	getDateString,
	tournamentTitleShort
} from '$lib/helpers/tournaments.js';
import { json, error as svelteError, type RequestEvent } from '@sveltejs/kit';
import Interpreter from 'sciolyff/interpreter';

export async function GET({ locals: { supabase, user } }: RequestEvent) {
    let res;
	let redisKey = 'results:all';
	if (user !== null && user.app_metadata.admin) {
		redisKey = 'results:all:admin';
	}
	if (await redis.exists(redisKey)) {
		const cachedResults = await redis.json.get(redisKey);
		if (cachedResults) {
			res = cachedResults;
		}
	} else {
		const { data, error } = await supabase.from('results').select('duosmium_id, updated_at');
		if (error) {
			return svelteError(500, { message: error.message });
		}
		const last_updated =
			data.length > 0
				? new Date(Math.max(...data.map((result) => new Date(result.updated_at).getTime())))
				: new Date();
		const output = {
			last_updated: last_updated,
			count: data.length,
			data: data.map((result) => result.duosmium_id)
		};
		await redis.json.set(redisKey, '$', output);
		res = output;
	}
        for (const name of res.data) {
        await addResultToQueue(name);
    }
    return new Response(null, {status: 201});
}