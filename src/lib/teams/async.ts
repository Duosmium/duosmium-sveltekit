/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

// @ts-ignore
import { Team } from 'sciolyff/interpreter';
import { getTrack } from '../tracks/async';
import { prisma } from '../global/prisma';
import { addLocation, getLocation } from '../locations/async';

export async function getTeam(tournamentID: number, number: number) {
	return await prisma.team.findUniqueOrThrow({
		where: {
			tournamentId_number: {
				tournamentId: tournamentID,
				number: number
			}
		}
	});
}

export async function teamExists(tournamentID: number, number: number) {
	return (
		(await prisma.team.count({
			where: {
				tournamentId: tournamentID,
				number: number
			}
		})) > 0
	);
}

export async function deleteTeam(tournamentID: number, number: number) {
	return await prisma.team.delete({
		where: {
			tournamentId_number: {
				tournamentId: tournamentID,
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
			tournamentId_number: {
				// @ts-ignore
				tournamentId: teamData.tournament.connect.id,
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

export async function createTeamDataInput(
	team: Team,
	tournamentID: number
) {
	const locationData = {
		name: team.school,
		city: team.city === undefined ? '' : team.city,
		state: team.state
	};
	let locationID;
	try {
		locationID = (await getLocation(locationData.name, locationData.city, locationData.state))[
			'id'
			];
	} catch (e) {
		locationID = (await addLocation(locationData))['id'];
	}
	let trackID = null;
	if (team.track) {
		trackID = (await getTrack(tournamentID, team.track.name))['id'];
	}
	const output = {
		tournament: {
			connect: {
				id: tournamentID
			}
		},
		number: team.number,
		location: {
			connect: {
				id: locationID
			}
		},
		rank: team.rank,
		trackRank: team.trackRank,
		points: team.points,
		trackPoints: team.trackPoints,
		earnedBid: team.earnedBid,
		// worstPlacingsToBeDropped can be calculated via queries
		trialEventPoints: team.trialEventPoints,
		trackTrialEventPoints: team.trackTrialEventPoints,
		medalCounts: team.medalCounts,
		trialEventMedalCounts: team.trialEventMedalCounts,
		trackMedalCounts: team.trackMedalCounts,
		trackTrialEventMedalCounts: team.trackTrialEventMedalCounts
	};
	if (trackID !== null) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		output['track'] = {
			connect: {
				id: trackID
			}
		};
	}
	return output;
}
