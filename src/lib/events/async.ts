// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Interpreter from 'sciolyff/interpreter';
import { ObjectId } from 'mongodb';
import { generateFilename } from '$lib/results/helpers';
import { db } from '$lib/global/database';
import {
	deleteAllValues,
	deleteValueByQuery,
	getAllValues,
	getValueByQuery,
	setValueToBlankArray,
	valueExistsByQuery
} from '$lib/global/async';
import { MONGO_ID_REGEX } from '$lib/global/helpers';

const collection = db.collection('events');

export async function getEvent(id: string): Promise<object> {
	if (MONGO_ID_REGEX.test(id)) {
		return getEventByMongoID(new ObjectId(id));
	} else {
		return getEventByName(id);
	}
}

export async function getEventByName(name: string): Promise<object> {
	return await getValueByQuery(collection, { name: name }, 'event');
}

export async function eventExistsByName(name: string): Promise<boolean> {
	return await valueExistsByQuery(collection, { name: name });
}

export async function deleteEventByName(name: string) {
	return await deleteValueByQuery(collection, { name: name });
}

export async function getEventByMongoID(mongoID: ObjectId): Promise<object> {
	return await getValueByQuery(collection, { _id: mongoID }, 'event');
}

export async function eventExistsByMongoID(mongoID: ObjectId): Promise<boolean> {
	return await valueExistsByQuery(collection, { _id: mongoID });
}

export async function deleteEventByMongoID(mongoID: ObjectId) {
	return await deleteValueByQuery(collection, { _id: mongoID });
}

export async function getAllEvents(): Promise<object> {
	return await getAllValues(collection, ['name'], 'name');
}

export async function deleteAllUnusedEvents() {
	// Delete all events that are not used by any results.
	return await deleteAllValues(collection, ['tournaments']);
}

export async function addEvent(name: string) {
	await collection.updateOne(
		{
			name: name
		},
		{
			$set: {
				name: name
			},
			$setOnInsert: {
				tournaments: []
			}
		},
		{ upsert: true }
	);
}

export async function addEventsFromInterpreter(interpreter: Interpreter) {
	const duosmiumID = generateFilename(interpreter);
	for (const event of interpreter.events) {
		await addEvent(event.name);
		await addTournamentToEvent(event.name, duosmiumID);
	}
}

async function addTournamentToEvent(event: string, duosmiumID: string) {
	return await collection.updateOne(
		{
			name: event,
			tournaments: {
				$nin: [duosmiumID]
			}
		},
		{
			$push: {
				tournaments: {
					$each: [duosmiumID],
					$sort: 1
				}
			}
		},
		{
			upsert: false
		}
	);
}

export async function removeTournamentFromAllEvents(duosmiumID: string) {
	const output = await collection.updateMany(
		{},
		{
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			$pull: {
				tournaments: duosmiumID
			}
		}
	);
	await deleteAllUnusedEvents();
	return output;
}

export async function clearAllTournamentsFromEvents() {
	return await setValueToBlankArray(collection, 'tournaments');
}

export async function deleteAllEvents() {
	await clearAllTournamentsFromEvents();
	return await deleteAllUnusedEvents();
}
