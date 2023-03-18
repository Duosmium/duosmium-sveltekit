// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Interpreter from 'sciolyff/interpreter';
import type { ObjectId } from 'mongodb';
import { generateFilename } from '$lib/results/helpers';
import { db } from '$lib/database';
import {
	deleteAllValues,
	deleteValueByQuery,
	getAllValues,
	getValueByQuery,
	valueExistsByQuery
} from '$lib/global/async';

const collection = db.collection('events');

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

export async function deleteAllEvents() {
	return await deleteAllValues(collection, ['tournaments']);
}

export async function addEvent(name: string) {
	await collection.createIndex({ name: 1 }, { unique: true });
	const EventExists = await eventExistsByName(name);
	if (EventExists) {
		throw new Error('This event already exists!');
	} else {
		await collection.insertOne({
			name: name,
			tournaments: []
		});
		return name;
	}
}

export async function addEventsFromInterpreter(interpreter: Interpreter) {
	const duosmiumID = generateFilename(interpreter);
	for (const evt of interpreter.events) {
		const name = evt.name;
		let event;
		try {
			event = await addEvent(name);
		} catch (e) {
			// do nothing
			event = name;
		}
		await addTournamentToEvent(event, duosmiumID);
	}
}

async function addTournamentToEvent(event: string, duosmiumID: string) {
	const eventExists = await eventExistsByName(event);
	if (!eventExists) {
		throw new Error('This Event does not already exist!');
	} else {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const tournaments: string[] = (await getEventByFullName(event))['tournaments'];
		if (!tournaments.includes(duosmiumID)) {
			await collection.updateOne(
				{
					name: event
				},
				{
					$push: {
						tournaments: {
							$each: [duosmiumID],
							$sort: 1
						}
					}
				}
			);
			return `Added ${duosmiumID} to ${event}`;
		} else {
			return `Did not add ${duosmiumID} to ${event} because it already exists`;
		}
	}
}
