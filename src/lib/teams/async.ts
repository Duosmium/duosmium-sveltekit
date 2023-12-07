// noinspection ES6RedundantAwait

// @ts-ignore
import { Team } from 'sciolyff/interpreter';
import { prisma } from '$lib/global/prisma';
import { STATES_BY_POSTAL_CODE } from '$lib/global/helpers';

export async function getTeam(duosmiumID: string, number: number) {
	return await prisma.team.findUniqueOrThrow({
		where: {
			result_duosmium_id_number: {
				result_duosmium_id: duosmiumID,
				number: number
			}
		}
	});
}

export async function getTeamData(duosmiumID: string) {
	const rawData = await prisma.team.findMany({
		where: {
			result_duosmium_id: duosmiumID
		},
		orderBy: {
			number: 'asc'
		},
		select: {
			data: true
		}
	});
	return rawData.map((i) => i.data);
}

export async function teamExists(duosmiumID: string, number: number) {
	return (
		(await prisma.team.count({
			where: {
				result_duosmium_id: duosmiumID,
				number: number
			}
		})) > 0
	);
}

export async function deleteTeam(duosmiumID: string, number: number) {
	return await prisma.team.delete({
		where: {
			result_duosmium_id_number: {
				result_duosmium_id: duosmiumID,
				number: number
			}
		}
	});
}

export async function deleteAllTeams() {
	return await prisma.team.deleteMany({});
}

export async function addTeam(teamData: object) {
	return await prisma.team.upsert({
		where: {
			result_duosmium_id_number: {
				// @ts-ignore
				result_duosmium_id: teamData.result_duosmium_id,
				// @ts-ignore
				number: teamData.number
			}
		},
		// @ts-ignore
		create: teamData,
		// @ts-ignore
		update: teamData
	});
}

export async function createTeamDataInput(team: Team) {
	return {
		number: team.number,
		data: team.rep,
		rank: team.rank,
		track_rank: team.trackRank === undefined ? null : team.trackRank,
		name: team.school,
		city: team.city ? team.city : "",
		state: team.state in STATES_BY_POSTAL_CODE ? team.state : "",
		country: team.state in STATES_BY_POSTAL_CODE ? "United States" : team.state,
	};
}
