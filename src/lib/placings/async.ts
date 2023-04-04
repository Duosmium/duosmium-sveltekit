/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore

import { Placing } from "sciolyff/interpreter";
import { prisma } from "$lib/global/prisma";
import { getEvent } from "../events/async";
import { createTournamentEventDataInput, getTournamentEvent } from "../tournamentevents/async";
import { getTeam } from "../teams/async";
import { getTrack } from "../tracks/async";
import { createTournamentDataInput } from "../tournaments/async";

export async function getPlacing(eventID: number, teamID: number) {
	return await prisma.placing.findUniqueOrThrow({
		where: {
			eventId_teamId: {
				eventId: eventID,
				teamId: teamID
			}
		}
	});
}

export async function tournamentExists(eventID: number, teamID: number) {
	return (
		(await prisma.placing.count({
			where: {
				eventId: eventID,
				teamId: teamID
			}
		})) > 0
	);
}

export async function deletePlacing(eventID: number, teamID: number) {
	return await prisma.placing.delete({
		where: {
			eventId_teamId: {
				eventId: eventID,
				teamId: teamID
			}
		}
	});
}

export async function deleteAllPlacings() {
	return await prisma.placing.deleteMany({});
}

export async function addPlacing(placingData: object) {
	// @ts-ignore
	const tournamentEventID = placingData.event.connect.id;
	// @ts-ignore
	const teamID = placingData.team.connect.id;
	return await prisma.placing.upsert({
		where: {
			eventId_teamId: {
				eventId: tournamentEventID,
				teamId: teamID
			}
		},
		create: placingData,
		update: placingData
	});
}

export async function createPlacingDataInput(
	placing: Placing,
	tournamentID: number
) {
	// @ts-ignore
	const eventID = (await getEvent(placing.event.name))['id'];
	const tournamentEventID = (await getTournamentEvent(tournamentID, eventID))['id'];
	// @ts-ignore
	const teamID = (await getTeam(tournamentID, placing.team?.number))['id'];
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
	if (placing.team.track !== undefined) {
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
				id: (await getTrack(tournamentID, placing.team.track.name))['id']
			}
		};
	}
	return output;
}
