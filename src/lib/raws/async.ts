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

export async function RawExists(placingID: number) {
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
	raw: Raw,
	tournamentID: number,
	tournamentEventID: number,
	teamID: number,
	placingID: number
) {
	const rawData = createDataInput(raw, tournamentID, tournamentEventID, teamID, placingID);
	return await prisma.raw.upsert({
		where: {
			placingId: placingID
		},
		// @ts-ignore
		create: rawData,
		update: rawData
	});
}

function createDataInput(
	raw: Raw,
	tournamentID: number,
	tournamentEventID: number,
	teamID: number,
	placingID: number
) {
	return {
		tournament: {
			connect: {
				id: tournamentID
			}
		},
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
