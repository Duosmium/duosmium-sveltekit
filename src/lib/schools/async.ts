// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Interpreter from 'sciolyff/interpreter';
import { fullSchoolName } from './helpers';
import { ObjectId } from 'mongodb';
import { generateFilename } from '$lib/results/helpers';
import { db } from '$lib/global/database';
import {
	deleteAllValues,
	deleteValueByQuery,
	getAllValues,
	getValueByQuery,
	setValueToBlankArray,
	valueExistsByQuery
} from '$lib/global/async';
import { MONGO_ID_REGEX } from '$lib/global/helpers';

const collection = db.collection('schools');

export async function getSchool(id: string): Promise<object> {
	if (MONGO_ID_REGEX.test(id)) {
		return getSchoolByMongoID(new ObjectId(id));
	} else {
		return getSchoolByFullName(id);
	}
}

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

export async function deleteAllUnusedSchools() {
	return await deleteAllValues(collection, ['tournaments']);
}

export async function addSchool(name: string, city: string | null, state: string) {
	const fullName = fullSchoolName(name, city, state);
	return await collection.updateOne(
		{
			full_name: fullName
		},
		{
			$set: {
				name: name,
				city: city,
				state: state,
				full_name: fullName
			},
			$setOnInsert: {
				tournaments: []
			}
		},
		{
			upsert: true
		}
	);
}

export async function addSchoolsFromInterpreter(interpreter: Interpreter) {
	const duosmiumID = generateFilename(interpreter);
	for (const team of interpreter.teams) {
		const name = team.school;
		const city = team.city;
		const state = team.state;
		await addSchool(name, city, state);
		await addTournamentToSchool(name, city, state, duosmiumID);
	}
}

async function addTournamentToSchool(
	name: string,
	city: string,
	state: string,
	duosmiumID: string
) {
	return await collection.updateOne(
		{
			name: name,
			city: city,
			state: state,
			full_name: fullSchoolName(name, city, state),
			tournaments: {
				$nin: [duosmiumID]
			}
		},
		{
			$push: {
				tournaments: {
					$each: [duosmiumID],
					$sort: 1
				}
			}
		},
		{
			upsert: false
		}
	);
}

export async function removeTournamentFromAllSchools(duosmiumID: string) {
	const output = await collection.updateMany(
		{},
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			$pull: {
				tournaments: duosmiumID
			}
		}
	);
	await deleteAllUnusedSchools();
	return output;
}

export async function clearAllTournamentsFromSchools() {
	return await setValueToBlankArray(collection, 'tournaments');
}

export async function deleteAllSchools() {
	await clearAllTournamentsFromSchools();
	return await deleteAllUnusedSchools();
}
