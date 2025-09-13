import redis from '$lib/helpers/redis.js';
import { fullSchoolNameFromLocation } from '$lib/helpers/schools';
import { json, error as svelteError } from '@sveltejs/kit';

export async function GET({ fetch, params, locals: { user } }) {
	if (!params.letter) {
		svelteError(400);
	}
	let redisKey = `schools:letters:${params.letter.toUpperCase()}:all`;
	if (user !== null && user.app_metadata.admin) {
		redisKey += ':admin';
	}
	if (await redis.exists(redisKey)) {
		const cachedSchools = await redis.json.get(redisKey);
		if (cachedSchools) {
			return json(cachedSchools);
		}
	} else {
		const output: { [key: string]: any } = {};
		const schools = await (await fetch(`/api/schools/letters/${params.letter}`)).json();
		for (const school of schools) {
			const fullName = fullSchoolNameFromLocation(
				school.name,
				school.city,
				school.state ?? school.country
			);
			const url = [
				'/api/schools',
				encodeURIComponent(school.country),
				encodeURIComponent(school.state),
				encodeURIComponent(school.city),
				encodeURIComponent(school.name)
			].join('/');
			output[fullName] = await (await fetch(url)).json();
		}
		await redis.json.set(redisKey, '$', output);
		return json(output);
	}
}
