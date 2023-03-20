/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

// @ts-ignore
import { Team } from 'sciolyff/interpreter';
import { getTrack } from '../tracks/async';
import { addSchool, getSchool } from '../schools/async';
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

export async function addTeam(team: Team, tournamentID: number) {
	const schoolData = { name: team.school, city: (team.city === undefined ? '' : team.city), state: team.state };
	let locationID;
	try {
		locationID = (await getLocation(schoolData.name, schoolData.city, schoolData.state))['id'];
	} catch (e) {
		locationID = (await addLocation(schoolData))['id'];
	}
	let schoolID;
	try {
		schoolID = (await getSchool(locationID))['id'];
	} catch (e) {
		schoolID = (await addSchool(schoolData))['id'];
	}
	let trackID = null;
	if (team.track) {
		trackID = (await getTrack(tournamentID, team.track.name))['id'];
	}
	const teamData = createDataInput(team, tournamentID, schoolID, trackID);
	return await prisma.team.upsert({
		where: {
			tournamentId_number: {
				tournamentId: tournamentID,
				number: team.number
			}
		},
		// @ts-ignore
		create: teamData,
		update: teamData
	});
}

function createDataInput(
	team: Team,
	tournamentID: number,
	schoolID: number,
	trackID: number | null
) {
	const output = {
		tournamentId: tournamentID,
		number: team.number,
		schoolId: schoolID,
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
		output['trackId'] = trackID;
	}
	return output;
}
