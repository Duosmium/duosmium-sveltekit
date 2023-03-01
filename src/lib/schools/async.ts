import { db } from '$lib/database';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Interpreter from 'sciolyff/interpreter';
import { error } from '@sveltejs/kit';
import { fullSchoolName } from './helpers';
import type { ObjectId } from 'mongodb';
import { generateFilename } from '$lib/results/helpers';

export async function getSchoolByName(
	name: string,
	city: string | null,
	state: string
): Promise<object> {
	if (!(await schoolExistsByName(name, city, state))) {
		throw error(404, 'No school found!');
	}
	const matches = await db.collection('schools').find({ name: name, city: city, state: state });
	const arr = await matches.toArray();
	return arr[0];
}

export async function schoolExistsByName(
	name: string,
	city: string | null,
	state: string
): Promise<boolean> {
	console.log(fullSchoolName(name, city, state));
	console.log(
		await db.collection('schools').countDocuments({ name: name, city: city, state: state })
	);
	return (
		(await db.collection('schools').countDocuments({ name: name, city: city, state: state })) > 0
	);
}

export async function getSchoolByFullName(fullName: string): Promise<object> {
	if (!(await schoolExistsByFullName(fullName))) {
		throw error(404, 'No school found!');
	}
	const matches = await db.collection('schools').find({ full_name: fullName });
	const arr = await matches.toArray();
	return arr[0];
}

export async function schoolExistsByFullName(fullName: string): Promise<boolean> {
	return (await db.collection('schools').countDocuments({ full_name: fullName })) > 0;
}

export async function getSchoolByMongoID(mongoID: ObjectId): Promise<object> {
	if (!(await schoolExistsByMongoID(mongoID))) {
		throw error(404, 'No school found!');
	}
	const matches = await db.collection('schools').find({ _id: mongoID });
	const arr = await matches.toArray();
	return arr[0];
}

export async function schoolExistsByMongoID(mongoID: ObjectId): Promise<boolean> {
	return (await db.collection('schools').countDocuments({ _id: mongoID })) > 0;
}

export async function getAllSchools(): Promise<object> {
	const matches = await db.collection('schools').find();
	const matchObject: object = {};
	let arr = await matches.toArray();
	arr = arr.sort((a, b) => (a['state'] > b['state'] ? 1 : -1));
	arr = arr.sort((a, b) => (a['city'] > b['city'] ? 1 : -1));
	arr = arr.sort((a, b) => (a['name'] > b['name'] ? 1 : -1));
	for (const arrElement of arr) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		matchObject[arrElement['full_name']] = arrElement;
	}
	return matchObject;
}

export async function addSchool(name: string, city: string | null, state: string) {
	const collection = db.collection('schools');
	collection.createIndex({ full_name: 1 }, { unique: true });
	const schoolExists = await schoolExistsByName(name, city, state);
	if (schoolExists) {
		throw error(400, 'This school already exists!');
	} else {
		const fullName = fullSchoolName(name, city, state);
		await collection.insertOne({
			name: name,
			city: city,
			state: state,
			full_name: fullName,
			tournaments: []
		});
		return fullName;
	}
}

export async function addSchoolsFromInterpreter(interpreter: Interpreter) {
	const duosmiumID = generateFilename(interpreter);
	for (const team of interpreter.teams) {
		const name = team.school;
		const city = team.city;
		const state = team.state;
		try {
			const school = await addSchool(name, city, state);
			console.log(`Added ${school}`);
			await addTournamentToSchool(school, duosmiumID);
		} catch (e) {
			// do nothing
			const school = fullSchoolName(name, city, state);
			await addTournamentToSchool(school, duosmiumID);
			console.log(`Did not add ${school} because it already exists`);
		}
	}
}

export async function handlePOSTedJSON(json: object) {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	await addSchool(json['name'], json['city'], json['state']);
}

async function addTournamentToSchool(school: string, duosmiumID: string) {
	const collection = db.collection('schools');
	const schoolExists = await schoolExistsByFullName(school);
	if (!schoolExists) {
		throw error(400, 'This school does not already exist!');
	} else {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		let tournaments: string[] = (await getSchoolByFullName(school))['tournaments'];
		if (!tournaments.includes(duosmiumID)) {
			tournaments.push(duosmiumID);
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			tournaments = tournaments.sort((a: string, b: string) => (a > b ? 1 : -1));
			collection.updateOne(
				{
					full_name: school
				},
				{
					$set: {
						tournaments: tournaments
					}
				}
			);
		}
	}
}
