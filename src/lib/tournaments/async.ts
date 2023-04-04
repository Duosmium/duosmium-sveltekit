/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

// @ts-ignore
import { Tournament } from 'sciolyff/interpreter';
import { addLocation } from '$lib/locations/async';
import { addTournamentEvent, createTournamentEventDataInput } from "../tournamentevents/async";
import { addTrack, createTrackDataInput } from "../tracks/async";
import { addTeam, createTeamDataInput } from "../teams/async";
import { getLocation } from '../locations/async';
import { prisma } from '../global/prisma';
// @ts-ignore
import type { Division, Level } from '@prisma/client';
import { addPlacing, createPlacingDataInput } from "../placings/async";
import { addPenalty, createPenaltyDataInput } from "../penalties/async";

export async function getTournament(resultID: number) {
	return await prisma.tournament.findUniqueOrThrow({
		where: {
			resultId: resultID
		}
	});
}

export async function tournamentExists(resultID: number) {
	return (
		(await prisma.tournament.count({
			where: {
				resultId: resultID
			}
		})) > 0
	);
}

export async function deleteTournament(resultID: number) {
	return await prisma.tournament.delete({
		where: {
			resultId: resultID
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
			resultId: tournamentData.result.connect.id
		},
		// @ts-ignore
		create: tournamentData,
		update: tournamentData
	});
}

export async function createTournamentDataInput(tournament: Tournament, resultID: number) {
	const locationData = { name: tournament.location, city: '', state: tournament.state };
	let locationID;
	try {
		// @ts-ignore
		locationID = (await getLocation(tournament.location, '', tournament.state))['id'];
	} catch (e) {
		locationID = (await addLocation(locationData))['id'];
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
			connect: {
				id: locationID
			}
		},
		result: {
			connect: {
				id: resultID
			}
		}
	};
}
