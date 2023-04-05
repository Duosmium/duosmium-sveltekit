/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

// @ts-ignore
import { Event } from "sciolyff/interpreter";
import { prisma } from "../global/prisma";

export async function getTournamentEvent(duosmiumID: string, eventName: string) {
	return await prisma.tournamentEvent.findUniqueOrThrow({
		where: {
			tournamentDuosmiumId_eventName: {
				tournamentDuosmiumId: duosmiumID,
				eventName: eventName
			}
		}
	});
}

export async function tournamentEventExists(duosmiumID: string, eventName: string) {
	return (
		(await prisma.tournamentEvent.count({
			where: {
				tournamentDuosmiumId: duosmiumID,
				eventName: eventName
			}
		})) > 0
	);
}

export async function deleteTournamentEvent(duosmiumID: string, eventName: string) {
	return await prisma.tournamentEvent.delete({
		where: {
			tournamentDuosmiumId_eventName: {
				tournamentDuosmiumId: duosmiumID,
				eventName: eventName
			}
		}
	});
}

export async function deleteAllTournamentEvents() {
	return await prisma.tournamentEvent.deleteMany({});
}

export async function addTournamentEvent(tournamentEventData: object) {
	return await prisma.tournamentEvent.upsert({
		where: {
			tournamentDuosmiumId_eventName: {
				// @ts-ignore
				tournamentDuosmiumId: tournamentEventData.tournamentDuosmiumId,
				// @ts-ignore
				eventName: tournamentEventData.eventName
			}
		},
		// @ts-ignore
		create: tournamentEventData,
		update: tournamentEventData
	});
}

export async function createTournamentEventDataInput(event: Event, duosmiumID: string) {
	return {
		event: {
			connectOrCreate: {
				create: {
					name: event.name
				},
				where: {
					name: event.name
				}
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
