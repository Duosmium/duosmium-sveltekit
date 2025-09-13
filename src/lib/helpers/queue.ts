import { Queue, Worker } from 'bullmq';
import { REDIS_HOST, REDIS_PORT } from '$env/static/private';
import { fullSchoolName, fullSchoolNameFromLocation, isUnitedStates } from './schools';
import { db } from '$lib/server/db';
import Interpreter from 'sciolyff/interpreter';
import { rankings, results, schools } from '../../../drizzle/schema';
import { and, eq, isNull, notExists } from 'drizzle-orm';
import redis from './redis';
import { TOURNAMENT_LEVELS } from './misc';
import { supabase } from './supabase';

const queue = new Queue('duosmium', {
	connection: {
		host: REDIS_HOST,
		port: REDIS_PORT ? parseInt(REDIS_PORT) : 6379
	}
});

const queueWorker = new Worker(
	'duosmium',
	async (job) => {
		if (job.data.operation === 'schools') {
			await updateAllSchoolsForResult(job.data.duosmiumID);
		} else if (job.data.operation === 'delete') {
			await deleteSchoolsWithNoRankings();
		} else if (job.data.operation === 'cache') {
			await cacheResult(job.data.duosmiumID);
		} else if (job.data.operation === 'public') {
			await cachePublicSharedData();
		}
	},
	{
		connection: {
			host: REDIS_HOST,
			port: REDIS_PORT ? parseInt(REDIS_PORT) : 6379
		},
		concurrency: 1
	}
);

queueWorker.on('completed', (job) => {
	if (job.data.operation === 'schools') {
		console.log(`Updated schools for Duosmium ID: ${job.data.duosmiumID}`);
	} else if (job.data.operation === 'delete') {
		console.log('Deleted schools with no rankings');
	} else if (job.data.operation === 'cache') {
		console.log(`Cached result for Duosmium ID: ${job.data.duosmiumID}`);
	} else if (job.data.operation === 'public') {
		console.log('Cached public shared data');
	}
});

queueWorker.on('failed', (job) => {
	if (job?.data.operation === 'schools') {
		console.log(`Failed to update schools for Duosmium ID: ${job.data.duosmiumID}`);
	} else if (job?.data.operation === 'delete') {
		console.log('Failed to delete schools with no rankings');
	} else if (job?.data.operation === 'cache') {
		console.log(`Failed to cache result for Duosmium ID: ${job.data.duosmiumID}`);
	} else if (job?.data.operation === 'public') {
		console.log('Failed to cache public shared data');
	}
});

queueWorker.on('stalled', (job) => {
	console.error(`Job stalled: ${job}`);
});

export async function addResultToQueue(duosmiumID: string) {
	if (!duosmiumID) throw new Error('Missing Duosmium ID');

	await queue.add(
		'duosmium',
		{ operation: 'schools', duosmiumID },
		{
			removeOnComplete: true,
			removeOnFail: true,
			deduplication: { id: `schools:${duosmiumID}` },
			priority: 10
		}
	);
	await queue.add(
		'duosmium',
		{ operation: 'delete' },
		{ removeOnComplete: true, removeOnFail: true, deduplication: { id: 'delete' }, priority: 20 }
	);
	await queue.add(
		'duosmium',
		{ operation: 'cache', duosmiumID },
		{
			removeOnComplete: true,
			removeOnFail: true,
			deduplication: { id: `cache:${duosmiumID}` },
			priority: 30
		}
	);
	await queue.add(
		'duosmium',
		{ operation: 'public' },
		{ removeOnComplete: true, removeOnFail: true, deduplication: { id: 'public' }, priority: 40 }
	);
}

export async function updateAllSchoolsForResult(duosmiumID: string) {
	console.log('Starting update for Duosmium ID:', duosmiumID);
	if (!duosmiumID) throw new Error('Missing Duosmium ID');

	const resultQuery = await db
		.select()
		.from(results)
		.where(eq(results.duosmiumId, duosmiumID))
		.limit(1);
	const result = resultQuery[0];
	console.log('Got result for Duosmium ID:', duosmiumID, !!result);
	if (!result) {
		throw new Error(`No result found for Duosmium ID: ${duosmiumID}`);
	}
	const id = result.id;
	const interpreter = new Interpreter(result.data);

	const existing = new Set<{ schoolID: number; rank: number }>();
	const changes = new Set<{ schoolID: number; rank: number }>();

	const schoolsToCreate = new Set<{
		school: string;
		city: string | null;
		state: string | null;
		country: string;
	}>();
	const schoolIDs = new Map<string, number>();

	await db.transaction(async (tx) => {
		const teams = interpreter.teams;
		const uniqueSchools = new Map<
			string,
			{ school: string; city: string | null; state: string | null; country: string }
		>();

		// First, collect all unique schools from teams
		for (const team of teams) {
			const school = team.school;
			const city = team.city ?? null;
			const state = isUnitedStates(team.state) ? team.state : null;
			const country = team.state && isUnitedStates(team.state) ? 'United States' : team.state;
			const schoolKey = `${school}|${city ?? 'null'}|${state ?? 'null'}|${country}`;

			if (!uniqueSchools.has(schoolKey)) {
				uniqueSchools.set(schoolKey, { school, city, state, country });
			}
		}

		// Check which schools already exist in database
		for (const [schoolKey, schoolData] of uniqueSchools) {
			const { school, city, state, country } = schoolData;
			const schoolCondition = eq(schools.name, school);
			const cityCondition = city ? eq(schools.city, city) : isNull(schools.city);
			const stateCondition = state ? eq(schools.state, state) : isNull(schools.state);
			const countryCondition = eq(schools.country, country);

			const databaseSchool = await tx
				.select({ id: schools.id })
				.from(schools)
				.where(and(schoolCondition, cityCondition, stateCondition, countryCondition))
				.limit(1);

			if (databaseSchool.length === 0) {
				schoolsToCreate.add(schoolData);
			} else {
				schoolIDs.set(schoolKey, databaseSchool[0].id);
			}
		}

		// Insert all new schools using upsert
		for (const school of schoolsToCreate) {
			const { school: name, city, state, country } = school;
			const schoolKey = `${name}|${city ?? 'null'}|${state ?? 'null'}|${country}`;

			const result = await tx
				.insert(schools)
				.values({ name, city, state, country })
				.onConflictDoUpdate({
					target: [schools.name, schools.city, schools.state, schools.country],
					set: { name: schools.name } // dummy update to return the existing row
				})
				.returning({ insertedId: schools.id });

			if (result.length > 0) {
				schoolIDs.set(schoolKey, result[0].insertedId);
			}
		}

		for (const team of interpreter.teams) {
			const school = team.school;
			const city = team.city ?? null;
			const state = isUnitedStates(team.state) ? team.state : null;
			const country = team.state && isUnitedStates(team.state) ? 'United States' : team.state;
			const schoolKey = `${school}|${city ?? 'null'}|${state ?? 'null'}|${country}`;
			if (!schoolIDs.has(schoolKey)) {
				throw new Error(`School not found: ${fullSchoolName(team)}`);
			}
			const schoolID = schoolIDs.get(schoolKey);
			if (!schoolID) {
				throw new Error(`School ID not found for: ${fullSchoolName(team)}`);
			}
			changes.add({ schoolID, rank: team.rank || 0 });
		}

		for (const schoolID of schoolIDs.values()) {
			const schoolRankings = await db
				.select()
				.from(rankings)
				.where(and(eq(rankings.schoolId, schoolID), eq(rankings.resultId, id)));
			for (const ranking of schoolRankings) {
				existing.add({ schoolID: ranking.schoolId, rank: ranking.rank });
			}
		}

		const remove = existing.difference(changes);
		const add = changes.difference(existing);

		for (const { schoolID, rank } of remove) {
			await tx
				.delete(rankings)
				.where(
					and(eq(rankings.schoolId, schoolID), eq(rankings.resultId, id), eq(rankings.rank, rank))
				);
		}
		for (const { schoolID, rank } of add) {
			await tx.insert(rankings).values({ resultId: id, schoolId: schoolID, rank });
		}
	});
}

export async function deleteSchoolsWithNoRankings() {
	await db
		.delete(schools)
		.where(notExists(db.select().from(rankings).where(eq(rankings.schoolId, schools.id))));
}

export async function cacheResult(duosmiumID: string) {
	const resultQuery = await db
		.select()
		.from(results)
		.where(eq(results.duosmiumId, duosmiumID))
		.limit(1);
	const result = resultQuery[0];
	if (!result) {
		throw new Error(`No result found for Duosmium ID: ${duosmiumID}`);
	}
	await redis.json.set(`result:${duosmiumID}`, '$', result);
}

export async function cachePublicSharedData() {
	const { data: latestResults, error: latestError } = await supabase
		.from('results')
		.select()
		.eq('hidden', false)
		.order('created_at', { ascending: false })
		.limit(5);
	if (latestError) {
		throw new Error(`Error fetching latest results: ${latestError.message}`);
	}
	await redis.json.set('results:latest', '$', latestResults);
	const { data: recentResults, error: recentError } = await supabase
		.from('results')
		.select()
		.eq('hidden', false)
		.order('duosmium_id', { ascending: false })
		.limit(24);
	if (recentError) {
		throw new Error(`Error fetching recent results: ${recentError.message}`);
	}
	await redis.json.set('results:recent', '$', recentResults);
	const levelCounts: { [key: string]: number } = {};
	for (const level of Object.keys(TOURNAMENT_LEVELS)) {
		const { count, error: levelError } = await supabase
			.from('results')
			.select('*', { count: 'exact', head: true })
			.eq('hidden', false)
			.eq('level', level);
		if (levelError) {
			throw new Error(`Error fetching level count for ${level}: ${levelError.message}`);
		}
		if (count !== null) {
			levelCounts[level] = count;
		}
	}
	levelCounts.total = Object.values(levelCounts).reduce((a, b) => a + b, 0);
	await redis.json.set('results:levels', '$', levelCounts);
	for (let season = new Date().getFullYear() + 1; season > 1985; season--) {
		const { data: seasonResults, error: seasonError } = await supabase
			.from('results')
			.select('duosmium_id, title, date_string, location, official, preliminary')
			.eq('season', season)
			.eq('hidden', false)
			.order('duosmium_id', { ascending: false });
		if (seasonError) {
			throw new Error(`Error fetching results for season ${season}: ${seasonError.message}`);
		}
		await redis.json.set(`results:season:${season}`, '$', seasonResults);
	}
	const { data: schoolLetters, error: schoolLettersError } = await supabase
		.from('schools')
		.select('id, name')
		.order('name', { ascending: true });
	if (schoolLettersError) {
		throw new Error(`Error fetching school letters: ${schoolLettersError.message}`);
	}
	const output: { [key: string]: number } = {};
	for (const school of schoolLetters) {
		if (!school.name || typeof school.name !== 'string') {
			continue; // Skip if name is not a string
		}
		const firstLetter = school.name[0].toUpperCase();
		output[firstLetter] = (output[firstLetter] || 0) + 1;
	}
	await redis.json.set('schools:all', '$', output);
	for (const letter of Object.keys(output)) {
		const { data: schoolsOfLetter, error: schoolsOfLetterError } = await supabase
			.from('schools')
			.select('id, name, city, state, country')
			.ilike('name', `${letter.toLowerCase()}%`)
			.order('name', { ascending: true })
			.order('city', { ascending: true })
			.order('state', { ascending: true })
			.order('country', { ascending: true });
		if (schoolsOfLetterError) {
			throw new Error(`Error fetching schools of letter ${letter}: ${schoolsOfLetterError.message}`);
		}
		const allRankings: { [key: string]: any} = {};
		for (const school of schoolsOfLetter) {
			const fullName = fullSchoolNameFromLocation(
				school.name,
				school.city,
				school.state ?? school.country
			);
			const { data: rankings, error: rankingsError } = await supabase
				.from('rankings')
				.select('results (title, duosmium_id), rank')
				.eq('school_id', school.id)
				.order('results (duosmium_id)', { ascending: false });
			if (rankingsError) {
				throw new Error(`Error fetching rankings for school ${fullName}`);
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
			const schoolTotalOutput = { id: school.id, rankings: output };
			await redis.json.set(`schools:${school.country}:${school.state === null ? 'null' : school.state}:${school.city === null ? 'null' : school.city}:${school.name}`, '$', schoolTotalOutput);
			allRankings[fullName] = schoolTotalOutput;
		}
		await redis.json.set(`schools:letters:${letter}:all`, '$', allRankings);
	}
}
