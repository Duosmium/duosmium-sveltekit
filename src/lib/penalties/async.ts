// noinspection ES6RedundantAwait

// @ts-ignore
import { Penalty } from 'sciolyff/interpreter';
import { prisma } from '$lib/global/prisma';

export async function getPenalty(duosmiumID: string, teamNumber: number) {
	return await prisma.penalty.findUniqueOrThrow({
		where: {
			result_duosmium_id_team_number: {
				result_duosmium_id: duosmiumID,
				team_number: teamNumber
			}
		}
	});
}

export async function getPenaltyData(duosmiumID: string) {
	const rawData = await prisma.penalty.findMany({
		where: {
			result_duosmium_id: duosmiumID
		},
		orderBy: {
			team_number: 'asc'
		},
		select: {
			data: true
		}
	});
	return rawData.map((i) => i.data);
}

export async function penaltyExists(duosmiumID: string, teamNumber: number) {
	return (
		(await prisma.penalty.count({
			where: {
				result_duosmium_id: duosmiumID,
				team_number: teamNumber
			}
		})) > 0
	);
}

export async function deletePenalty(duosmiumID: string, teamNumber: number) {
	return await prisma.penalty.delete({
		where: {
			result_duosmium_id_team_number: {
				result_duosmium_id: duosmiumID,
				team_number: teamNumber
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
			result_duosmium_id_team_number: {
				// @ts-ignore
				result_duosmium_id: penaltyData.result_duosmium_id,
				// @ts-ignore
				team_number: penaltyData.team_number
			}
		},
		// @ts-ignore
		create: penaltyData,
		update: penaltyData
	});
}

export async function createPenaltyDataInput(penalty: Penalty, duosmiumID: string) {
	return {
		team: {
			connect: {
				result_duosmium_id_number: {
					result_duosmium_id: duosmiumID,
					number: penalty.team.number
				}
			}
		},
		data: penalty.rep,
		result_duosmium_id: duosmiumID,
		team_number: penalty.team.number
	};
}
