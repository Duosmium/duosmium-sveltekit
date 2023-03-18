// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Interpreter from 'sciolyff/interpreter';
import { fullSchoolName } from './helpers';
import type { ObjectId } from 'mongodb';
import { generateFilename } from '$lib/results/helpers';
import { db } from '$lib/database';
import {
	deleteAllValues,
	deleteValueByQuery,
	getAllValues,
	getValueByQuery,
	valueExistsByQuery
} from '$lib/global/async';

const collection = db.collection('schools');

export async function getSchoolByName(
	name: string,
	city: string | null,
	state: string
): Promise<object> {
	return await getValueByQuery(collection, { name: name, city: city, state: state }, 'school');
}

export async function schoolExistsByName(
	name: string,
	city: string | null,
	state: string
): Promise<boolean> {
	return await valueExistsByQuery(collection, { name: name, city: city, state: state });
}

export async function getSchoolByFullName(fullName: string): Promise<object> {
	return await getValueByQuery(collection, { full_name: fullName }, 'school');
}

export async function schoolExistsByFullName(fullName: string): Promise<boolean> {
	return await valueExistsByQuery(collection, { full_name: fullName });
}

export async function deleteSchoolByFullName(fullName: string) {
	return await deleteValueByQuery(collection, { full_name: fullName });
}

export async function getSchoolByMongoID(mongoID: ObjectId): Promise<object> {
	return await getValueByQuery(collection, { _id: mongoID }, 'school');
}

export async function schoolExistsByMongoID(mongoID: ObjectId): Promise<boolean> {
	return await valueExistsByQuery(collection, { _id: mongoID });
}

export async function deleteSchoolByMongoID(mongoID: ObjectId) {
	return await deleteValueByQuery(collection, { _id: mongoID });
}

export async function getAllSchools(): Promise<object> {
	return await getAllValues(collection, ['full_name'], 'full_name');
}

export async function deleteAllSchools() {
	return await deleteAllValues(collection, ['tournaments']);
}

export async function addSchool(name: string, city: string | null, state: string) {
	await collection.createIndex({ full_name: 1 }, { unique: true });
	const schoolExists = await schoolExistsByName(name, city, state);
	if (schoolExists) {
		throw new Error('This school already exists!');
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
		let school;
		try {
			school = await addSchool(name, city, state);
		} catch (e) {
			// do nothing
			school = fullSchoolName(name, city, state);
		}
		await addTournamentToSchool(school, duosmiumID);
	}
}

async function addTournamentToSchool(school: string, duosmiumID: string) {
	const schoolExists = await schoolExistsByFullName(school);
	if (!schoolExists) {
		throw new Error('This school does not already exist!');
	} else {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const tournaments: string[] = (await getSchoolByFullName(school))['tournaments'];
		if (!tournaments.includes(duosmiumID)) {
			await collection.updateOne(
				{
					full_name: school
				},
				{
					$push: {
						tournaments: {
							$each: [duosmiumID],
							$sort: 1
						}
					}
				}
			);
			return `Added ${duosmiumID} to ${school}`;
		} else {
			return `Did not add ${duosmiumID} to ${school} because it already exists`;
		}
	}
}
