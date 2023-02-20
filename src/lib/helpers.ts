import { db } from './database';
import { dump } from 'js-yaml';

const sciolyff = (await import("sciolyff")).default;

export async function getResult(duosmiumID: string): Promise<object> {
	const matches = await db.collection("results").find({duosmium_id: duosmiumID});
	const numOfMatches = await db.collection("results").countDocuments({duosmium_id: duosmiumID})
	if (numOfMatches === 0) {
		throw new Error("No result found!")
	}
	const arr = await matches.toArray();
	return arr[0]["result"];
}

export function objectToYAML(obj: object) {
	return dump(obj).replace("T00:00:00.000Z", "");
}

export function getInterpreter(yaml: string) {
	return new sciolyff.Interpreter(yaml);
}