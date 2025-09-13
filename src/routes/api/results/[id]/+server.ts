import Interpreter from 'sciolyff/interpreter';
import { json, error as svelteError, type RequestEvent } from '@sveltejs/kit';
import { apiCheckAdmin } from '$lib/helpers/auth';
import {
	generateFilename,
	getDateString,
	tournamentTitle,
	tournamentTitleShort
} from '$lib/helpers/tournaments';
import { addResultToQueue } from '$lib/helpers/queue';
import redis from '$lib/helpers/redis';

export async function GET({ locals: { supabase, user }, params }: RequestEvent) {
	if (await redis.exists(`result:${params.id}`)) {
		const cachedResult = await redis.json.get(`result:${params.id}`);
		if (cachedResult) {
			if (cachedResult.hidden) {
				await apiCheckAdmin(user);
			}
			return json(cachedResult);
		}
	} else {
		const { data, error } = await supabase.from('results').select('*').eq('duosmium_id', params.id);
		if (error) {
			return svelteError(500, { message: error.message });
		}
		if (data.length === 0) {
			return svelteError(404, { message: 'Result not found' });
		}
		await redis.json.set(`result:${params.id}`, '$', data[0]);
		return json(data[0]);
	}
}

export async function POST({ locals: { supabase, user }, request, params }: RequestEvent) {
	await apiCheckAdmin(user);
	const { data, error: databaseError } = await supabase
		.from('results')
		.select('id')
		.eq('duosmium_id', params.id);
	if (databaseError) {
		return svelteError(500, { message: databaseError.message });
	}
	const databaseID = data[0].id;
	const result = await request.json();
	try {
		const interpreter = new Interpreter(result.data);
		const title = tournamentTitle(interpreter.tournament);
		const shortTitle = tournamentTitleShort(interpreter.tournament);
		const duosmiumID = result.duosmium_id ?? generateFilename(interpreter);
		const { data, error } = await supabase
			.from('results')
			.update({
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
				season: result.tournament.year,
				updated_at: new Date().toISOString()
			})
			.eq('id', databaseID);
		if (error) {
			return svelteError(500, { message: error.message });
		}
		await addResultToQueue(duosmiumID);
		return json(data);
	} catch (error: any) {
		return svelteError(400, { message: error.message || 'Invalid result' });
	}
}

export async function DELETE({ locals: { supabase, user }, params }: RequestEvent) {
	await apiCheckAdmin(user);
	const { data, error } = await supabase.from('results').delete().eq('duosmium_id', params.id);
	if (error) {
		return svelteError(500, { message: error.message });
	}
	return json(data);
}
