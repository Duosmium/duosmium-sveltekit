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