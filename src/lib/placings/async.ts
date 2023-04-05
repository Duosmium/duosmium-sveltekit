/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore

import { Placing } from "sciolyff/interpreter";
import { prisma } from "$lib/global/prisma";
import { createRawDataInput } from "../raws/async";

export async function getPlacing(duosmiumID: string, eventName: string, teamNumber: number) {
	return await prisma.placing.findUniqueOrThrow({
		where: {
			tournamentDuosmiumId_eventName_teamNumber: {
				tournamentDuosmiumId: duosmiumID,
				eventName: eventName,
				teamNumber: teamNumber
			}
		}
	});
}

export async function tournamentExists(duosmiumID: string, eventName: string, teamNumber: number) {
	return (
		(await prisma.placing.count({
			where: {
				tournamentDuosmiumId: duosmiumID,
				eventName: eventName,
				teamNumber: teamNumber
			}
		})) > 0
	);
}

export async function deletePlacing(duosmiumID: string, eventName: string, teamNumber: number) {
	return await prisma.placing.delete({
		where: {
			tournamentDuosmiumId_eventName_teamNumber: {
				tournamentDuosmiumId: duosmiumID,
				eventName: eventName,
				teamNumber: teamNumber
			}
		}
	});
}

export async function deleteAllPlacings() {
	return await prisma.placing.deleteMany({});
}

export async function addPlacing(placingData: object) {
	return await prisma.placing.upsert({
		where: {
			tournamentDuosmiumId_eventName_teamNumber: {
				// @ts-ignore
				tournamentDuosmiumId: placingData.tournamentDuosmiumId,
				// @ts-ignore
				eventName: placingData.eventName,
				// @ts-ignore
				teamNumber: placingData.teamNumber
			}
		},
		// @ts-ignore
		create: placingData,
		update: placingData
	});
}

export async function createPlacingDataInput(
	placing: Placing,
	duosmiumID: string
) {
	// @ts-ignore
	const output = {
		tournamentEvent: {
			connect: {
				tournamentDuosmiumId_eventName: {
					tournamentDuosmiumId: duosmiumID,
					eventName: placing.event.name
				}
			}
		},
		team: {
			connect: {
				tournamentDuosmiumId_number: {
					tournamentDuosmiumId: duosmiumID,
					number: placing.team.number
				}
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
				tournamentDuosmiumId_name: {
					tournamentDuosmiumId: duosmiumID,
					name: placing.team.track.name
				}
			}
		};
	}
	if (placing.raw !== undefined) {
		// @ts-ignore
		output['raw'] = {
			connectOrCreate: {
				create: await createRawDataInput(placing, duosmiumID),
				where: {
					tournamentDuosmiumId_eventName_teamNumber: {
						tournamentDuosmiumId: duosmiumID,
						eventName: placing.event.name,
						teamNumber: placing.team.number
					}
				}
			}
		}
	}
	return output;
}
