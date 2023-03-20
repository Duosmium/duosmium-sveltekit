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

export async function addPenalty(penalty: Penalty, tournamentID: number) {
	// @ts-ignore
	const teamID = (await getTeam(tournamentID, penalty.team?.number))['id'];
	let trackID = null;
	if (penalty.team?.track) {
		trackID = (await getTrack(tournamentID, penalty.team.track.name))['id'];
	}
	const penaltyData = createDataInput(penalty, tournamentID, teamID, trackID);
	return await prisma.penalty.upsert({
		where: {
			tournamentId_teamId: {
				tournamentId: tournamentID,
				teamId: teamID
			}
		},
		// @ts-ignore
		create: penaltyData,
		update: penaltyData
	});
}

function createDataInput(
	penalty: Penalty,
	tournamentID: number,
	teamID: number,
	trackID: number | null
) {
	const output = {
		tournamentId: tournamentID,
		teamId: teamID
	};
	if (trackID !== null) {
		// @ts-ignore
		output['trackId'] = trackID;
	}
	return output;
}
