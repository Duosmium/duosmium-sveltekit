import type { Collection } from 'mongodb';

export async function getValueByQuery(
	collection: Collection,
	query: object,
	category: string
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
		matchObject[arrElement[objKey]] = arrElement['result'];
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
	for (const field in emptyFields) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		query[field] = {
			$in: [[]]
		};
	}
	return await collection.deleteMany(query);
}

export async function deleteValueByQuery(collection: Collection, query: object) {
	return await collection.deleteOne(query);
}
