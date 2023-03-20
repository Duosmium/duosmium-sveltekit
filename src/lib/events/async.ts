// noinspection ES6RedundantAwait

import { prisma } from '../global/prisma';

export async function getEvent(name: string) {
	return await prisma.event.findUniqueOrThrow({
		where: {
			name: name
		}
	});
}

export async function eventExists(name: string) {
	return (
		(await prisma.event.count({
			where: {
				name: name
			}
		})) > 0
	);
}

export async function deleteEvent(name: string) {
	return await prisma.event.delete({
		where: {
			name: name
		}
	});
}

export async function deleteAllEvents() {
	return await prisma.event.deleteMany({});
}

export async function addEvent(eventData: object) {
	return await prisma.event.upsert({
		where: {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			name: eventData.name
		},
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		create: eventData,
		update: eventData
	});
}
