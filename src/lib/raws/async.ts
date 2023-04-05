/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

// @ts-ignore
import { Placing, Raw } from 'sciolyff/interpreter';
import { prisma } from '../global/prisma';

export async function getRaw(duosmiumID: string, eventName: string, teamNumber: number) {
	return await prisma.raw.findUniqueOrThrow({
		where: {
			tournamentDuosmiumId_eventName_teamNumber: {
				tournamentDuosmiumId: duosmiumID,
				eventName: eventName,
				teamNumber: teamNumber
			}
		}
	});
}

export async function rawExists(duosmiumID: string, eventName: string, teamNumber: number) {
	return (
		(await prisma.raw.count({
			where: {
				tournamentDuosmiumId: duosmiumID,
				eventName: eventName,
				teamNumber: teamNumber
			}
		})) > 0
	);
}

export async function deleteRaw(duosmiumID: string, eventName: string, teamNumber: number) {
	return await prisma.raw.delete({
		where: {
			tournamentDuosmiumId_eventName_teamNumber: {
				tournamentDuosmiumId: duosmiumID,
				eventName: eventName,
				teamNumber: teamNumber
			}
		}
	});
}

export async function deleteAllRaws() {
	return await prisma.raw.deleteMany({});
}

export async function addRaw(
	rawData: object
) {
	return await prisma.raw.upsert({
		where: {
			tournamentDuosmiumId_eventName_teamNumber: {
				// @ts-ignore
				tournamentDuosmiumId: rawData.tournamentDuosmiumId,
				// @ts-ignore
				eventName: rawData.eventName,
				// @ts-ignore
				teamNumber: rawData.teamNumber
			}
		},
		// @ts-ignore
		create: rawData,
		update: rawData
	});
}

export async function createRawDataInput(placing: Placing, duosmiumID: string) {
	const raw = placing.raw;
	return {
		tournamentEvent: {
			connect: {
				tournamentDuosmiumId_eventName: {
					tournamentDuosmiumId: duosmiumID,
					eventName: placing.event.name
				}
			}
		},
		lowScoreWins: raw.lowScoreWins,
		score: raw.score,
		tier: raw.tier,
		tiered: raw.tiered,
		tiebreakerRank: raw.tiebreakerRank,
		lostTieBreaker: raw.lostTiebreaker,
		placing: {
			connect: {
				tournamentDuosmiumId_eventName_teamNumber: {
					tournamentDuosmiumId: duosmiumID,
					eventName: placing.event.name,
					teamNumber: placing.team.number
				}
			}
		},
		team: {
			connect: {
				tournamentDuosmiumId_number: {
					tournamentDuosmiumId: duosmiumID,
					number: placing.team.number
				}
			}
		}
	};
}