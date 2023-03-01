import { db } from '$lib/database';
import { dump, load } from 'js-yaml';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Interpreter from 'sciolyff/interpreter';
import { error } from '@sveltejs/kit';
import { generateFilename } from './helpers';
import { addSchoolsFromInterpreter } from '$lib/schools/async';
import type { ObjectId } from 'mongodb';

export async function getResultByDuosmiumID(duosmiumID: string): Promise<object> {
	if (!(await resultExistsByDuosmiumID(duosmiumID))) {
		throw error(404, 'No result found!');
	}
	const matches = await db.collection('results').find({ duosmium_id: duosmiumID });
	const arr = await matches.toArray();
	return arr[0]['result'];
}

export async function resultExistsByDuosmiumID(duosmiumID: string): Promise<boolean> {
	return (await db.collection('results').countDocuments({ duosmium_id: duosmiumID })) > 0;
}

export async function getResultByMongoID(mongoID: ObjectId): Promise<object> {
	if (!(await resultExistsByMongoID(mongoID))) {
		throw error(404, 'No result found!');
	}
	const matches = await db.collection('results').find({ _id: mongoID });
	const arr = await matches.toArray();
	return arr[0]['result'];
}

export async function resultExistsByMongoID(mongoID: ObjectId): Promise<boolean> {
	return (await db.collection('results').countDocuments({ _id: mongoID })) > 0;
}

export async function getAllResults(): Promise<object> {
	const matches = await db.collection('results').find();
	const matchObject: object = {};
	let arr = await matches.toArray();
	arr = arr.sort((a, b) => (a['duosmium_id'] > b['duosmium_id'] ? -1 : 1));
	for (const arrElement of arr) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		matchObject[arrElement['duosmium_id']] = arrElement['result'];
	}
	return matchObject;
}

export async function handleUploadedYAML(file: File) {
	const yaml = await file.text();
	const obj = load(yaml);
	await addResult(yaml, obj);
}

export async function handlePOSTedJSON(json: object) {
	const yaml = dump(json);
	await addResult(yaml, json);
}

async function addResult(yaml: string, obj: object | unknown) {
	let interpreter;
	try {
		interpreter = new Interpreter(yaml);
	} catch (e) {
		throw error(400, 'The uploaded data is not valid SciolyFF!');
	}
	const fileName = generateFilename(interpreter);
	const collection = db.collection('results');
	collection.createIndex({ duosmium_id: 1 }, { unique: true });
	if (await resultExistsByDuosmiumID(fileName)) {
		// throw error(400, 'This result already exists!');
		await collection.updateOne(
			{
				duosmium_id: fileName
			},
			{
				$set: {
					result: obj
				}
			}
		);
	} else {
		await collection.insertOne({
			duosmium_id: fileName,
			result: obj
		});
	}
	await addSchoolsFromInterpreter(interpreter);
	return fileName;
}
