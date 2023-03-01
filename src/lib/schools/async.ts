import { db } from '$lib/database';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Interpreter from 'sciolyff/interpreter';
import { error } from '@sveltejs/kit';
import { fullSchoolName } from './helpers';
import type { ObjectId } from 'mongodb';

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
	if (await schoolExistsByName(name, city, state)) {
		throw error(400, 'This school already exists!');
	} else {
		const fullName = fullSchoolName(name, city, state);
		await collection.insertOne({
			name: name,
			city: city,
			state: state,
			full_name: fullName
		});
		return fullName;
	}
}

export async function addSchoolsFromInterpreter(interpreter: Interpreter) {
	for (const team of interpreter.teams) {
		const name = team.school;
		const city = team.city;
		const state = team.state;
		try {
			const school = await addSchool(name, city, state);
			console.log(`Added ${school}`);
		} catch (e) {
			// do nothing
			console.log(`Did not add ${fullSchoolName(name, city, state)} because it already exists`);
		}
	}
}

export async function handlePOSTedJSON(json: object) {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	await addSchool(json['name'], json['city'], json['state']);
}
