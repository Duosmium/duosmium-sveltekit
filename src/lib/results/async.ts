// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Interpreter from 'sciolyff/interpreter';
import { generateFilename } from './helpers';
import {
	addSchoolsFromInterpreter,
	deleteAllSchools,
	removeTournamentFromAllSchools
} from '$lib/schools/async';
import { ObjectId } from 'mongodb';
import { db } from '$lib/global/database';
import { load } from 'js-yaml';
import {
	addEventsFromInterpreter,
	deleteAllEvents,
	removeTournamentFromAllEvents
} from '$lib/events/async';
import {
	deleteAllValues,
	deleteValueByQuery,
	getAllValues,
	getFieldFromMongoID,
	getValueByQuery,
	valueExistsByQuery
} from '$lib/global/async';
import { MONGO_ID_REGEX } from '$lib/global/helpers';

const collection = db.collection('results');

export async function getResult(id: string): Promise<object> {
	if (MONGO_ID_REGEX.test(id)) {
		return getResultByMongoID(new ObjectId(id));
	} else {
		return getResultByDuosmiumID(id);
	}
}

export async function resultExists(id: string): Promise<boolean> {
	if (MONGO_ID_REGEX.test(id)) {
		return resultExistsByMongoID(new ObjectId(id));
	} else {
		return resultExistsByDuosmiumID(id);
	}
}

export async function deleteResult(id: string) {
	if (MONGO_ID_REGEX.test(id)) {
		id = await getDuosmiumIDFromMongoID(new ObjectId(id));
	}
	await removeTournamentFromAllSchools(id);
	await removeTournamentFromAllEvents(id);
	return await deleteResultByDuosmiumID(id);
}

async function getDuosmiumIDFromMongoID(mongoID: ObjectId) {
	return await getFieldFromMongoID(collection, mongoID, 'duosmium_id');
}

async function getResultByDuosmiumID(duosmiumID: string): Promise<object> {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return (await getValueByQuery(collection, { duosmium_id: duosmiumID }, 'result'))['result'];
}

async function resultExistsByDuosmiumID(duosmiumID: string): Promise<boolean> {
	return await valueExistsByQuery(collection, { duoamium_id: duosmiumID });
}

async function deleteResultByDuosmiumID(duosmiumID: string) {
	return await deleteValueByQuery(collection, { duosmium_id: duosmiumID });
}

async function getResultByMongoID(mongoID: ObjectId): Promise<object> {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return (await getValueByQuery(collection, { _id: mongoID }, 'result'))['result'];
}

async function resultExistsByMongoID(mongoID: ObjectId): Promise<boolean> {
	return await valueExistsByQuery(collection, { _id: mongoID });
}

async function deleteResultByMongoID(mongoID: ObjectId) {
	return await deleteValueByQuery(collection, { _id: mongoID });
}

export async function getAllResults(): Promise<object> {
	return await getAllValues(collection, ['duosmium_id'], 'duosmium_id');
}

export async function deleteAllResults() {
	const output = await deleteAllValues(collection);
	await deleteAllSchools();
	await deleteAllEvents();
	return output;
}

export async function addResultFromYAMLFile(file: File) {
	const yaml = await file.text();
	const obj = load(yaml);
	await addResult(obj);
}

export async function addResult(obj: object | unknown) {
	let interpreter;
	try {
		interpreter = new Interpreter(obj);
	} catch (e) {
		throw new Error('The uploaded data is not valid SciolyFF!');
	}
	const fileName = generateFilename(interpreter);
	await collection.updateOne(
		{
			duosmium_id: fileName
		},
		{
			$set: {
				result: obj
			}
		},
		{
			upsert: true
		}
	);
	await addSchoolsFromInterpreter(interpreter);
	await addEventsFromInterpreter(interpreter);
	return fileName;
}
