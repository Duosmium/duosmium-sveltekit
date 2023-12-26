// noinspection ES6RedundantAwait

// @ts-ignore
import Interpreter, { Team } from 'sciolyff/interpreter';
import { prisma } from '$lib/global/prisma';
import { ordinalize, STATES_BY_POSTAL_CODE } from '$lib/global/helpers';
import { getAllCompleteResults } from '$lib/results/async';
import { getInterpreter } from '$lib/results/interpreter';
import { formatSchool, teamLocation } from '$lib/results/helpers';

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
		city: team.city ? team.city : '',
		state: team.state in STATES_BY_POSTAL_CODE ? team.state : '',
		country: team.state in STATES_BY_POSTAL_CODE ? 'United States' : team.state
	};
}

export async function getTournamentsPerSchool(letter: string | undefined = undefined) {
	const allTeams = await prisma.team.findMany({
		select: {
			name: true,
			city: true,
			state: true,
			country: true,
			rank: true,
			result: {
				select: {
					full_title: true,
					duosmium_id: true
				}
			}
		},
		orderBy: [
			{
				name: 'asc'
			},
			{
				city: 'asc'
			},
			{
				state: 'asc'
			},
			{
				country: 'asc'
			},
			{
				result_duosmium_id: 'desc'
			},
			{
				rank: 'asc'
			}
		],
		where: {
			name: {
				startsWith: letter,
				mode: 'insensitive'
			}
		}
	});
	const rankMap: Map<string, Map<string, string[]>> = new Map();
	const tournamentNames: Map<string, string> = new Map();
	for (const team of allTeams) {
		const teamStr = `${team.name} (${team.city ? `${team.city}, ${team.state}` : `${team.state}`})`;
		if (!rankMap.has(teamStr)) {
			rankMap.set(teamStr, new Map());
		}
		const tournamentInfo = [team.result.duosmium_id, team.result.title];
		if (!rankMap.get(teamStr)?.has(tournamentInfo[0])) {
			rankMap.get(teamStr)?.set(tournamentInfo[0], []);
		}
		rankMap.get(teamStr)?.get(tournamentInfo[0])?.push(ordinalize(team.rank));
		if (!tournamentNames.has(tournamentInfo[0])) {
			tournamentNames.set(tournamentInfo[0], tournamentInfo[1]);
		}
	}
	return [rankMap, tournamentNames];
}

export async function getFirstLetter() {
	// https://github.com/prisma/prisma/issues/5068 -- this sort should be case-insensitive but isn't
	// until it is, we'll use a different (slower) method to avoid edge cases (e.g. the first letter being D for duPont)
	return (
		await prisma.team.findMany({
			distinct: ['name'],
			select: {
				name: true
			}
		})
	)
		.map((t) => t.name.toLowerCase()[0])
		.sort()[0];
}

export async function getAllFirstLetters() {
	const teamNames = await prisma.team.findMany({
		distinct: ['name'],
		select: {
			name: true
		},
		orderBy: {
			name: 'asc'
		}
	});
	const letters: string[] = [];
	const letterSet: Set<string> = new Set();
	for (const team of teamNames) {
		const lowerLetter = team.name[0].toLowerCase();
		if (!letterSet.has(lowerLetter)) {
			letters.push(lowerLetter);
			letterSet.add(lowerLetter);
		}
	}
	return letters;
}
