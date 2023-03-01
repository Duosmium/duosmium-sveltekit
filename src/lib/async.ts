import { db } from './database';

export async function getResult(duosmiumID: string): Promise<object> {
	const matches = await db.collection('results').find({ duosmium_id: duosmiumID });
	const numOfMatches = await db.collection('results').countDocuments({ duosmium_id: duosmiumID });
	if (numOfMatches === 0) {
		throw new Error('No result found!');
	}
	const arr = await matches.toArray();
	return arr[0]['result'];
}

export async function getAllResults(): Promise<object> {
	const matches = await db.collection('results').find();
	const matchObject: object = {};
	let arr = await matches.toArray();
	arr = arr.sort(function(a, b) {
		const nameA = a["duosmium_id"];
		const nameB = b["duosmium_id"];
		if (nameA > nameB) {
			return 1;
		}
		if (nameA < nameB) {
			return -1;
		}
		return 0;
	});
	console.log(arr[0]["duosmium_id"])
	for (const arrElement of arr) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		matchObject[arrElement["duosmium_id"]] = arrElement["result"];
	}
	// console.log(matchObject);
	return matchObject;
}