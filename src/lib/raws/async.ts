/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

// @ts-ignore
import { Raw } from 'sciolyff/interpreter';
import { prisma } from '../global/prisma';

export async function getRaw(placingID: number) {
	return await prisma.raw.findUniqueOrThrow({
		where: {
			placingId: placingID
		}
	});
}

export async function rawExists(placingID: number) {
	return (
		(await prisma.raw.count({
			where: {
				placingId: placingID
			}
		})) > 0
	);
}

export async function deleteRaw(placingID: number) {
	return await prisma.raw.delete({
		where: {
			placingId: placingID
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
			// @ts-ignore
			placingId: rawData.placing.connect.id
		},
		// @ts-ignore
		create: rawData,
		update: rawData
	});
}

export async function createRawDataInput(raw: Raw, tournamentEventID: number, teamID: number, placingID: number) {
	return {
		event: {
			connect: {
				id: tournamentEventID
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
				id: placingID
			}
		},
		team: {
			connect: {
				id: teamID
			}
		}
	};
}