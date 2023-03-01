import { db } from './database';
import { dump, load } from 'js-yaml';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Interpreter from 'sciolyff/interpreter';
import { error } from '@sveltejs/kit';
import { generateFilename } from './helpers';

export async function getResult(duosmiumID: string): Promise<object> {
	const matches = await db.collection('results').find({ duosmium_id: duosmiumID });
	if (!(await resultExists(duosmiumID))) {
		throw new Error('No result found!');
	}
	const arr = await matches.toArray();
	return arr[0]['result'];
}

export async function resultExists(duosmiumID: string): Promise<boolean> {
	return (await db.collection('results').countDocuments({ duosmium_id: duosmiumID })) > 0;
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
	await addOrReplaceResult(yaml, obj);
}

export async function handlePOSTedJSON(json: object) {
	const yaml = dump(json);
	await addOrReplaceResult(yaml, json);
}

async function addOrReplaceResult(yaml: string, obj: object | unknown) {
	let interpreter;
	try {
		interpreter = new Interpreter(yaml);
	} catch (e) {
		throw error(400, 'The uploaded data is not valid SciolyFF!');
	}
	const fileName = generateFilename(interpreter);
	const collection = db.collection('results');
	if (await resultExists(fileName)) {
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
	return fileName;
}
