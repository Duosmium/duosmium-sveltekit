// noinspection ES6RedundantAwait

// @ts-ignore
import { Tournament } from 'sciolyff/interpreter';
import { prisma } from '$lib/global/prisma';

export async function getTournament(duosmiumID: string) {
	return await prisma.tournament.findUniqueOrThrow({
		where: {
			result_duosmium_id: duosmiumID
		}
	});
}

export async function getTournamentData(duosmiumID: string) {
	const rawData = await prisma.tournament.findUnique({
		where: {
			result_duosmium_id: duosmiumID
		}
	});
	if (rawData === null) {
		return null;
	} else {
		return rawData.data;
	}
}

export async function tournamentExists(duosmiumID: string) {
	return (
		(await prisma.tournament.count({
			where: {
				result_duosmium_id: duosmiumID
			}
		})) > 0
	);
}

export async function deleteTournament(duosmiumID: string) {
	return await prisma.tournament.delete({
		where: {
			result_duosmium_id: duosmiumID
		}
	});
}

export async function deleteAllTournaments() {
	return await prisma.tournament.deleteMany({});
}

export async function addTournament(tournamentData: object) {
	return await prisma.tournament.upsert({
		where: {
			// @ts-ignore
			result_duosmium_id: tournamentData.result_duosmium_id
		},
		// @ts-ignore
		create: tournamentData,
		update: tournamentData
	});
}

export async function createTournamentDataInput(tournament: Tournament) {
	return {
		data: tournament.rep
	};
}

export async function getAllTournamentsByLevel(level: string) {
	return await prisma.tournament.findMany({
		where: {
			data: {
				path: ['level'],
				equals: level
			}
		}
	});
}

export async function countAllTournamentsByLevel(level: string) {
	return await prisma.tournament.count({
		where: {
			data: {
				path: ['level'],
				equals: level
			}
		}
	});
}
