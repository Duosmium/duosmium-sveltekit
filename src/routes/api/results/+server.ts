import { apiCheckAdmin } from '$lib/helpers/auth.js';
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
	let redisKey = 'results:all';
	if (user !== null && user.app_metadata.admin) {
		redisKey = 'results:all:admin';
	}
	if (await redis.exists(redisKey)) {
		const cachedResults = await redis.json.get(redisKey);
		if (cachedResults) {
			return json(cachedResults);
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
		return json(output);
	}
}

export async function POST({ locals: { supabase, user }, request }: RequestEvent) {
	await apiCheckAdmin(user);
	const result = await request.json();
	try {
		const interpreter = new Interpreter(result.data);
		const title = `${interpreter.tournament.year} ${tournamentTitle(interpreter.tournament)}`;
		const shortTitle = `${interpreter.tournament.year} ${tournamentTitleShort(interpreter.tournament)}`;
		const duosmiumID = result.duosmium_id ?? generateFilename(interpreter);
		const { data, error } = await supabase.from('results').insert({
			duosmium_id: duosmiumID,
			title: title,
			short_title: shortTitle,
			level: interpreter.tournament.level,
			location: interpreter.tournament.location,
			date_string: getDateString(interpreter.tournament),
			data: result.data,
			official: result.official ?? undefined,
			preliminary: result.preliminary ?? undefined,
			logo: result.logo ?? undefined,
			hidden: result.hidden ?? undefined,
			season: interpreter.tournament.year
		});
		if (error) {
			svelteError(500, { message: error.message });
		}
		await addResultToQueue(duosmiumID);
		return json(data);
	} catch (error) {
		svelteError(400, { message: error.body.message || 'Invalid result' });
	}
}

export async function DELETE({ locals: { supabase } }: RequestEvent) {
	await apiCheckAdmin(user);
	const { data, error } = await supabase.from('results').delete();
	if (error) {
		return svelteError(500, { message: error.message });
	}
	return json(data);
}
