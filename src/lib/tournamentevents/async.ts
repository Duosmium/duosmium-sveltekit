/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

// @ts-ignore
import { Event } from 'sciolyff/interpreter';
import { addEvent, getEvent } from '../events/async';
import { prisma } from '../global/prisma';

export async function getTournamentEvent(tournamentID: number, eventID: number) {
	return await prisma.tournamentEvent.findUniqueOrThrow({
		where: {
			tournamentId_eventId: {
				tournamentId: tournamentID,
				eventId: eventID
			}
		}
	});
}

export async function tournamentEventExists(tournamentID: number, eventID: number) {
	return (
		(await prisma.tournamentEvent.count({
			where: {
				tournamentId: tournamentID,
				eventId: eventID
			}
		})) > 0
	);
}

export async function deleteTournamentEvent(tournamentID: number, eventID: number) {
	return await prisma.tournamentEvent.delete({
		where: {
			tournamentId_eventId: {
				tournamentId: tournamentID,
				eventId: eventID
			}
		}
	});
}

export async function deleteAllTournamentEvents() {
	return await prisma.tournamentEvent.deleteMany({});
}

export async function addTournamentEvent(event: Event, tournamentID: number) {
	let eventID;
	try {
		eventID = (await getEvent(event.name))['id'];
	} catch (e) {
		const eventData = { name: event.name };
		eventID = (await addEvent(eventData))['id'];
	}
	const tournamentEventData = createDataInput(event, tournamentID, eventID);
	return await prisma.tournamentEvent.upsert({
		where: {
			tournamentId_eventId: {
				tournamentId: tournamentID,
				eventId: eventID
			}
		},
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		create: tournamentEventData,
		update: tournamentEventData
	});
}

function createDataInput(event: Event, tournamentID: number, eventID: number) {
	return {
		tournament: {
			connect: {
				id: tournamentID
			}
		},
		event: {
			connect: {
				id: eventID
			}
		},
		trial: event.trial,
		trialed: event.trialed,
		lowScoreWins: event.lowScoreWins,
		highScoreWins: event.highScoreWins,
		medals: event.medals,
		maximumPlace: event.maximumPlace
	};
}
