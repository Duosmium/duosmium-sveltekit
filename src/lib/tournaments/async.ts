/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

// @ts-ignore
import { Tournament } from "sciolyff/interpreter";
import { createTournamentEventDataInput } from "../tournamentevents/async";
import { createTeamDataInput } from "../teams/async";
import { prisma } from "../global/prisma";
// @ts-ignore
import type { Division, Level } from "@prisma/client";
import { createPlacingDataInput } from "../placings/async";
import { createPenaltyDataInput } from "../penalties/async";

export async function getTournament(duosmiumID: string) {
	return await prisma.tournament.findUniqueOrThrow({
		where: {
			resultDuosmiumId: duosmiumID
		}
	});
}

export async function tournamentExists(duosmiumID: string) {
	return (
		(await prisma.tournament.count({
			where: {
				resultDuosmiumId: duosmiumID
			}
		})) > 0
	);
}

export async function deleteTournament(duosmiumID: string) {
	return await prisma.tournament.delete({
		where: {
			resultDuosmiumId: duosmiumID
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
			resultDuosmiumId: tournamentData.resultDuosmiumId
		},
		// @ts-ignore
		create: tournamentData,
		update: tournamentData
	});
}

export async function createTournamentDataInput(tournament: Tournament, duosmiumID: string) {
	const locationData = { name: tournament.location, city: '', state: tournament.state, country: "United States" };
	const teamData = [];
	for (const team of tournament.teams) {
		const thisTeamData = await createTeamDataInput(team, duosmiumID);
		teamData.push({
			create: thisTeamData,
			where: {
				tournamentDuosmiumId_number: {
					tournamentDuosmiumId: duosmiumID,
					number: team.number
				}
			}
		});
	}
	const tournamentEventData = [];
	for (const tournamentEvent of tournament.events) {
		const thisTournamentEventData = await createTournamentEventDataInput(tournamentEvent, duosmiumID);
		tournamentEventData.push({
			create: thisTournamentEventData,
			where: {
				tournamentDuosmiumId_eventName: {
					tournamentDuosmiumId: duosmiumID,
					eventName: tournamentEvent.name
				}
			}
		})
	}
	const placingData = [];
	for (const placing of tournament.placings) {
		const thisPlacingData = await createPlacingDataInput(placing, duosmiumID);
		placingData.push({
			create: thisPlacingData,
			where: {
				tournamentDuosmiumId_eventName_teamNumber: {
					tournamentDuosmiumId: duosmiumID,
					eventName: placing.event.name,
					teamNumber: placing.team.number
				}
			}
		});
	}
	const penaltyData = [];
	for (const penalty of tournament.penalties) {
		const thisPenaltyData = await createPenaltyDataInput(penalty, duosmiumID);
		penaltyData.push({
			create: thisPenaltyData,
			where: {
				tournamentDuosmiumId_teamNumber: {
					tournamentDuosmiumId: duosmiumID,
					teamNumber: penalty.team.number
				}
			}
		});
	}
	return {
		level: <Level>tournament.level,
		division: <Division>tournament.division,
		year: tournament.year,
		name: tournament.name,
		shortName: tournament.shortName,
		medals: tournament.medals,
		trophies: tournament.trophies,
		bids: tournament.bids,
		bidsPerSchool: tournament.bidsPerSchool,
		worstPlacingsDropped: tournament.worstPlacingsDropped,
		exemptPlacings: tournament.exemptPlacings,
		reverseScoring: tournament.reverseScoring,
		maximumPlace: tournament.maximumPlace,
		perEventN: tournament.perEventN,
		nOffset: tournament.nOffset,
		startDate: tournament.startDate,
		endDate: tournament.endDate,
		awardsDate: tournament.awardsDate,
		testRelease: tournament.testRelease,
		hasCustomMaximumPlace: tournament.hasCustomMaximumPlace,
		hasTies: tournament.hasTies,
		hasTiesOutsideOfMaximumPlaces: tournament.hasTiesOutsideOfMaximumPlaces,
		hasTracks: tournament.hasTracks,
		largestPlace: tournament.largestPlace,
		nonExhibitionTeamsCount: tournament.nonExhibitionTeamsCount,
		location: {
			connectOrCreate: {
				create: locationData,
				where: {
					name_city_state_country: locationData
				}
			}
		},
		teams: {
			connectOrCreate: teamData[0]
		},
		tournamentEvents: {
			connectOrCreate: tournamentEventData
		},
		placings: {
			connectOrCreate: placingData
		},
		penalties: {
			connectOrCreate: penaltyData
		}
	};
}
