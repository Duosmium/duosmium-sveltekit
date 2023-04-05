/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

// @ts-ignore
import { Penalty } from 'sciolyff/interpreter';
import { prisma } from '../global/prisma';

export async function getPenalty(duosmiumID: string, teamNumber: number) {
	return await prisma.penalty.findUniqueOrThrow({
		where: {
			tournamentDuosmiumId_teamNumber: {
				tournamentDuosmiumId: duosmiumID,
				teamNumber: teamNumber
			}
		}
	});
}

export async function penaltyExists(duosmiumID: string, teamNumber: number) {
	return (
		(await prisma.penalty.count({
			where: {
				tournamentDuosmiumId: duosmiumID,
				teamNumber: teamNumber
			}
		})) > 0
	);
}

export async function deletePenalty(duosmiumID: string, teamNumber: number) {
	return await prisma.penalty.delete({
		where: {
			tournamentDuosmiumId_teamNumber: {
				tournamentDuosmiumId: duosmiumID,
				teamNumber: teamNumber
			}
		}
	});
}

export async function deleteAllPenalties() {
	return await prisma.penalty.deleteMany({});
}

export async function addPenalty(penaltyData: object) {
	return await prisma.penalty.upsert({
		where: {
			tournamentDuosmiumId_teamNumber: {
				// @ts-ignore
				tournamentDuosmiumId: penaltyData.tournamentDuosmiumId,
				// @ts-ignore
				teamNumber: penaltyData.teamNumber
			}
		},
		// @ts-ignore
		create: penaltyData,
		update: penaltyData
	});
}

export async function createPenaltyDataInput(
	penalty: Penalty,
	duosmiumID: string,
) {
	const output = {
		team: {
			connect: {
				tournamentDuosmiumId_number: {
					tournamentDuosmiumId: duosmiumID,
					number: penalty.team.number
				}
			}
		},
		points: penalty.points
	};
	if (penalty.team?.track) {
		// @ts-ignore
		output['track'] = {
			connect: {
				tournamentDuosmiumId_name: {
					tournamentDuosmiumId: duosmiumID,
					name: penalty.track.name.toString()
				}
			}
		};
	}
	return output;
}
