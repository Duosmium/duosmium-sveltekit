/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

// @ts-ignore
import { Tournament } from 'sciolyff/interpreter';
import { addLocation } from '$lib/locations/async';
import { addTournamentEvent } from '../tournamentevents/async';
import { addTrack } from '../tracks/async';
import { addTeam } from '../teams/async';
import { getLocation } from '../locations/async';
import { prisma } from '../global/prisma';
import type { Division, Level } from '@prisma/client';
import { addPlacing } from '../placings/async';
import { addPenalty } from '../penalties/async';

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

export async function addTournament(tournament: Tournament, resultID: number) {
	const locationData = { name: tournament.location, city: '', state: tournament.state };
	let locationID;
	try {
		// @ts-ignore
		locationID = (await getLocation(tournament.location, '', tournament.state))['id'];
	} catch (e) {
		locationID = (await addLocation(locationData))['id'];
	}
	const tournamentData = createDataInput(tournament, resultID, locationID);
	const tournamentOutput = await prisma.tournament.upsert({
		where: {
			resultId: resultID
		},
		// @ts-ignore
		create: tournamentData,
		update: tournamentData
	});
	const tournamentID = tournamentOutput['id'];
	// @ts-ignore
	for (const event of tournament.events) {
		await addTournamentEvent(event, tournamentID);
	}
	// @ts-ignore
	for (const track of tournament.tracks) {
		await addTrack(track, tournamentID);
	}
	// @ts-ignore
	for (const team of tournament.teams) {
		await addTeam(team, tournamentID);
	}
	// @ts-ignore
	for (const placing of tournament.placings) {
		// @ts-ignore
		await addPlacing(placing, tournamentID);
	}
	// @ts-ignore
	for (const penalty of tournament.penalties) {
		// @ts-ignore
		await addPenalty(penalty, tournamentID);
	}
	return tournamentOutput;
}

function createDataInput(tournament: Tournament, resultID: number, locationID: number) {
	return {
		// locationId: locationID,
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
		// resultId: resultID
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
