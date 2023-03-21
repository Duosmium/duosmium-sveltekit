/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore

import { Placing } from 'sciolyff/interpreter';
import { prisma } from '$lib/global/prisma';
import { getEvent } from '../events/async';
import { getTournamentEvent } from '../tournamentevents/async';
import { getTeam } from '../teams/async';
import { getTrack } from '../tracks/async';
import { addRaw } from "../raws/async";

export async function getPlacing(tournamentID: number, eventID: number, teamID: number) {
	return await prisma.placing.findUniqueOrThrow({
		where: {
			tournamentId_eventId_teamId: { tournamentId: tournamentID, eventId: eventID, teamId: teamID }
		}
	});
}

export async function tournamentExists(tournamentID: number, eventID: number, teamID: number) {
	return (
		(await prisma.placing.count({
			where: {
				tournamentId: tournamentID,
				eventId: eventID,
				teamId: teamID
			}
		})) > 0
	);
}

export async function deletePlacing(tournamentID: number, eventID: number, teamID: number) {
	return await prisma.placing.delete({
		where: {
			tournamentId_eventId_teamId: { tournamentId: tournamentID, eventId: eventID, teamId: teamID }
		}
	});
}

export async function deleteAllPlacings() {
	return await prisma.placing.deleteMany({});
}

export async function addPlacing(placing: Placing, tournamentID: number) {
	// @ts-ignore
	const eventID = (await getEvent(placing.event.name))['id'];
	const tournamentEventID = (await getTournamentEvent(tournamentID, eventID))['id'];
	// @ts-ignore
	const teamID = (await getTeam(tournamentID, placing.team?.number))['id'];
	let trackID = null;
	// @ts-ignore
	if (placing.team.track) {
		// @ts-ignore
		trackID = (await getTrack(tournamentID, placing.team.track.name))['id'];
	}
	const placingData = createDataInput(placing, tournamentID, tournamentEventID, teamID, trackID);
	const placingOutput = await prisma.placing.upsert({
		where: {
			tournamentId_eventId_teamId: {
				tournamentId: tournamentID,
				eventId: eventID,
				teamId: teamID
			}
		},
		// @ts-ignore
		create: placingData,
		update: placingData
	});
	const placingID = placingOutput['id'];
	if (placing.raw !== undefined) {
		await addRaw(placing.raw, tournamentID, tournamentEventID, teamID, placingID);
	}
	return placingOutput;
}

function createDataInput(
	placing: Placing,
	tournamentID: number,
	tournamentEventID: number,
	teamID: number,
	trackID: number | null
) {
	const output = {
		tournament: {
			connect: {
				id: tournamentID
			}
		},
		event: {
			connect: {
				id: tournamentEventID
			}
		},
		team: {
			connect: {
				id: teamID
			}
		},
		participated: placing.participated,
		disqualified: placing.disqualified,
		exempt: placing.exempt,
		unknown: placing.unknown,
		explicit: placing.explicit,
		// hasRaw can be calculated via database queries
		// didNotParticipate can be calculated via database queries
		participationOnly: placing.participationOnly,
		droppedAsPartOfWorstPlacings: placing.droppedAsPartOfWorstPlacings,
		tie: placing.tie,
		place: placing.place,
		initiallyConsideredForTeamPoints: placing.initiallyConsideredForTeamPoints,
		consideredForTeamPoints: placing.consideredForTeamPoints,
		isolatedPoints: placing.isolatedPoints,
		points: placing.points,
		pointsAffectedByExhibition: placing.pointsAffectedByExhibition,
		pointsLimitedByMaximumPlace: placing.pointsLimitedByMaximumPlace,
		exhibitionPlacingsBehind: placing._exhibitionPlacingsBehind
	};
	if (trackID !== null) {
		// @ts-ignore
		output['trackPlace'] = placing.trackPlace;
		// @ts-ignore
		output['isolatedTrackPoints'] = placing.isolatedTrackPoints;
		// @ts-ignore
		output['trackPoints'] = placing.trackPoints;
		// @ts-ignore
		output['trackExhibitionPlacingsBehind'] = placing._trackExhibitonPlacingsBehind;
		// @ts-ignore
		output['track'] = {
			connect: {
				id: trackID
			}
		};
	}
	return output;
}
