// @ts-ignore

import { Placing } from 'sciolyff/interpreter';
import { prisma } from '$lib/global/prisma';

export async function getPlacing(duosmiumID: string, event_name: string, teamNumber: number) {
	// noinspection ES6RedundantAwait
	return await prisma.placing.findUniqueOrThrow({
		where: {
			result_duosmium_id_event_name_team_number: {
				result_duosmium_id: duosmiumID,
				event_name: event_name,
				team_number: teamNumber
			}
		}
	});
}

export async function getPlacingData(duosmiumID: string) {
	// noinspection TypeScriptValidateJSTypes
	const rawData = await prisma.placing.findMany({
		where: {
			result_duosmium_id: duosmiumID
		},
		orderBy: [
			{
				team_number: 'asc'
			},
			{
				event_name: 'asc'
			}
		]
	});
	return rawData.map((i) => i.data);
}

export async function placingExists(duosmiumID: string, event_name: string, teamNumber: number) {
	return (
		(await prisma.placing.count({
			where: {
				result_duosmium_id: duosmiumID,
				event_name: event_name,
				team_number: teamNumber
			}
		})) > 0
	);
}

export async function deletePlacing(duosmiumID: string, event_name: string, teamNumber: number) {
	// noinspection ES6RedundantAwait
	return await prisma.placing.delete({
		where: {
			result_duosmium_id_event_name_team_number: {
				result_duosmium_id: duosmiumID,
				event_name: event_name,
				team_number: teamNumber
			}
		}
	});
}

export async function deleteAllPlacings() {
	// noinspection ES6RedundantAwait
	return await prisma.placing.deleteMany({});
}

export async function addPlacing(placingData: object) {
	// noinspection TypeScriptValidateJSTypes
	return prisma.placing.upsert({
		where: {
			result_duosmium_id_event_name_team_number: {
				// @ts-ignore
				result_duosmium_id: placingData.result_duosmium_id,
				// @ts-ignore
				event_name: placingData.event_name,
				// @ts-ignore
				team_number: placingData.team_number
			}
		},
		// @ts-ignore
		create: placingData,
		update: placingData
	});
}

export async function createPlacingDataInput(placing: Placing, duosmiumID: string) {
	return {
		event: {
			connect: {
				result_duosmium_id_name: {
					result_duosmium_id: duosmiumID,
					name: placing.event.name
				}
			}
		},
		team: {
			connect: {
				result_duosmium_id_number: {
					result_duosmium_id: duosmiumID,
					number: placing.team.number
				}
			}
		},
		data: placing.rep,
		result_duosmium_id: duosmiumID,
		event_name: placing.event.name,
		team_number: placing.team.number
	};
}
