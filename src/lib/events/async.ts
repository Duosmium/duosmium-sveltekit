// noinspection ES6RedundantAwait

// @ts-ignore
import { Event } from 'sciolyff/interpreter';
import { prisma } from '$lib/global/prisma';

export async function getEvent(duosmiumID: string, eventName: string) {
	return await prisma.event.findUniqueOrThrow({
		where: {
			result_duosmium_id_name: {
				result_duosmium_id: duosmiumID,
				name: eventName
			}
		}
	});
}

export async function getEventData(duosmiumID: string) {
	const rawData = await prisma.event.findMany({
		where: {
			result_duosmium_id: duosmiumID
		},
		select: {
			data: true
		},
		orderBy: {
			name: 'asc'
		}
	});
	return rawData.map((i) => i.data);
}

export async function eventExists(duosmiumID: string, eventName: string) {
	return (
		(await prisma.event.count({
			where: {
				result_duosmium_id: duosmiumID,
				name: eventName
			}
		})) > 0
	);
}

export async function deleteEvent(duosmiumID: string, eventName: string) {
	return await prisma.event.delete({
		where: {
			result_duosmium_id_name: {
				result_duosmium_id: duosmiumID,
				name: eventName
			}
		}
	});
}

export async function deleteAllEvents() {
	return await prisma.event.deleteMany({});
}

export async function addEvent(resultEventData: object) {
	return await prisma.event.upsert({
		where: {
			result_duosmium_id_name: {
				// @ts-ignore
				result_duosmium_id: resultEventData.result_duosmium_id,
				// @ts-ignore
				name: resultEventData.name
			}
		},
		// @ts-ignore
		create: resultEventData,
		update: resultEventData
	});
}

export async function createEventDataInput(event: Event) {
	return {
		name: event.name,
		data: event.rep
	};
}
