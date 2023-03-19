import type { Collection } from 'mongodb';
import type { ObjectId } from 'mongodb';
import { db } from './database';

export async function getValueByQuery(
	collection: Collection,
	query: object,
	category = 'value'
): Promise<object> {
	const matches = await collection.find(query);
	const arr = await matches.toArray();
	if (arr.length < 1) {
		throw new Error(`No ${category} found!`);
	}
	return arr[0];
}

export async function valueExistsByQuery(collection: Collection, query: object): Promise<boolean> {
	return (await collection.countDocuments(query)) > 0;
}

export async function getAllValues(
	collection: Collection,
	sortKeys: string[],
	objKey: string,
	reverse = false
): Promise<object> {
	const matches = await collection.find();
	const matchObject: object = {};
	const arr = sortArrayByKeys(await matches.toArray(), sortKeys, reverse);
	for (const arrElement of arr) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		matchObject[arrElement[objKey]] = arrElement;
	}
	return matchObject;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sortArrayByKeys(arr: any[], sortKeys: string[], reverse = false) {
	for (let i = sortKeys.length - 1; i > -1; i--) {
		const key = sortKeys[i];
		if (reverse) {
			arr = arr.sort((a, b) => (a[key] > b[key] ? -1 : 1));
		} else {
			arr = arr.sort((a, b) => (a[key] > b[key] ? 1 : -1));
		}
	}
	return arr;
}

export async function deleteAllValues(collection: Collection, emptyFields: string[] = []) {
	const query: object = {};
	for (let i = 0; i < emptyFields.length; i++) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		query[emptyFields[i]] = { $exists: true, $size: 0 };
	}
	return await collection.deleteMany(query);
}

export async function deleteValueByQuery(collection: Collection, query: object) {
	return await collection.deleteOne(query);
}

export async function getFieldFromMongoID(
	collection: Collection,
	mongoID: ObjectId,
	field: string
) {
	// Get a field from an object in a collection given a Mongo ID.
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return (await getValueByQuery(collection, { _id: mongoID }))[field];
}

export async function deleteEntireDatabase() {
	// Delete all data in the database. THIS IS A HIGHLY DESTRUCTIVE OPERATION!
	return await db.dropDatabase();
}

export async function setValueToBlankArray(collection: Collection, field: string) {
	const query = {
		$set: {}
	};
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	query['$set'][field] = [];
	return await collection.updateMany({}, query);
}
