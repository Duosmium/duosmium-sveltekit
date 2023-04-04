/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

// @ts-ignore
import { Penalty } from 'sciolyff/interpreter';
import { getTeam } from '../teams/async';
import { prisma } from '../global/prisma';
import { getTrack } from '../tracks/async';

export async function getPenalty(tournamentID: number, teamID: number) {
	return await prisma.penalty.findUniqueOrThrow({
		where: {
			tournamentId_teamId: {
				tournamentId: tournamentID,
				teamId: teamID
			}
		}
	});
}

export async function penaltyExists(tournamentID: number, teamID: number) {
	return (
		(await prisma.penalty.count({
			where: {
				tournamentId: tournamentID,
				teamId: teamID
			}
		})) > 0
	);
}

export async function deletePenalty(tournamentID: number, teamID: number) {
	return await prisma.penalty.delete({
		where: {
			tournamentId_teamId: {
				tournamentId: tournamentID,
				teamId: teamID
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
			tournamentId_teamId: {
				// @ts-ignore
				tournamentId: penaltyData.tournament.connect.id,
				// @ts-ignore
				teamId: penaltyData.team.connect.id
			}
		},
		// @ts-ignore
		create: penaltyData,
		update: penaltyData
	});
}

export async function createPenaltyDataInput(
	penalty: Penalty,
	tournamentID: number,
) {
	const output = {
		tournament: {
			connect: {
				id: tournamentID
			}
		},
		team: {
			connect: {
				id: (await getTeam(tournamentID, penalty.team?.number))['id']
			}
		}
	};
	if (penalty.team?.track) {
		// @ts-ignore
		output['track'] = {
			connect: {
				id: (await getTrack(tournamentID, penalty.team.track.name))['id']
			}
		};
	}
	return output;
}
