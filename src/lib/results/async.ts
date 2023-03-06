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
	const matches = await db.collection('results').find({ duosmium_id: duosmiumID });
	const arr = await matches.toArray();
	if (arr.length < 1) {
		throw error(404, 'No result found!');
	}
	return arr[0]['result'];
}

export async function resultExistsByDuosmiumID(duosmiumID: string): Promise<boolean> {
	return (await db.collection('results').countDocuments({ duosmium_id: duosmiumID })) > 0;
}

export async function deleteResultByDuosmiumID(duosmiumID: string) {
	await db.collection('results').deleteOne({ duosmium_id: duosmiumID });
}

export async function getResultByMongoID(mongoID: ObjectId): Promise<object> {
	const matches = await db.collection('results').find({ _id: mongoID });
	const arr = await matches.toArray();
	if (arr.length < 1) {
		throw error(404, 'No result found!');
	}
	return arr[0]['result'];
}

export async function resultExistsByMongoID(mongoID: ObjectId): Promise<boolean> {
	return (await db.collection('results').countDocuments({ _id: mongoID })) > 0;
}

export async function deleteResultByMongoID(mongoID: ObjectId) {
	await db.collection('results').deleteOne({ _id: mongoID });
}

export async function getAllResults(): Promise<object> {
	const matches = await db.collection('results').find();
	const matchObject: object = {};
	let arr = await matches.toArray();
	arr = arr.sort((a, b) => (a['duosmium_id'] > b['duosmium_id'] ? 1 : -1));
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
	await collection.createIndex({ duosmium_id: 1 }, { unique: true });
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

export async function deleteAllResults() {
	await db.collection('results').drop();
}
