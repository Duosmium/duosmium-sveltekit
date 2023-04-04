/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

// @ts-ignore
import Interpreter from 'sciolyff/interpreter';
import { generateFilename } from './helpers';
import { load } from 'js-yaml';
import { getInterpreter } from './interpreter';
import { addTournament, createTournamentDataInput } from "../tournaments/async";
import { keepTryingUntilItWorks, prisma } from "../global/prisma";
import { addHistogram, createHistogramDataInput } from "../histograms/async";
import { addHistoData, createHistoDataDataInput } from "../histodata/async";
import { addTournamentEvent, createTournamentEventDataInput, getTournamentEvent } from "../tournamentevents/async";
import { getEvent } from '../events/async';
import { addRaw, createRawDataInput } from "../raws/async";
import { addTrack, createTrackDataInput } from "../tracks/async";
import { addPenalty, createPenaltyDataInput } from "../penalties/async";
import { addTeam, createTeamDataInput } from "../teams/async";
import { addPlacing, createPlacingDataInput } from "../placings/async";

export async function getResult(duosmiumID: string) {
	return await prisma.result.findUniqueOrThrow({
		where: {
			duosmiumId: duosmiumID
		}
	});
}

export async function resultExists(duosmiumID: string) {
	return (
		(await prisma.result.count({
			where: {
				duosmiumId: duosmiumID
			}
		})) > 0
	);
}

export async function deleteResult(duosmiumID: string) {
	return await prisma.result.delete({
		where: {
			duosmiumId: duosmiumID
		}
	});
}

export async function deleteAllResults() {
	return await prisma.result.deleteMany({});
}

export async function addResultFromYAMLFile(file: File) {
	const yaml = await file.text();
	// @ts-ignore
	const obj: object = load(yaml);
	// await addResult(getInterpreter(obj));
	await superCursedAttemptToCreateAResult(getInterpreter(obj));
}

export async function addResult(resultData: object) {
	return await prisma.result.upsert({
		where: resultData,
		create: resultData,
		update: resultData
	});
}

export async function createResultDataInput(interpreter: Interpreter) {
	const duosmiumID = generateFilename(interpreter);
	return {
		duosmiumId: duosmiumID
	}
}

export async function superCursedAttemptToCreateAResult(interpreter: Interpreter) {
	// const resultID = (await addResult(await createResultDataInput(interpreter)))['id'];
	const resultID = (await keepTryingUntilItWorks(addResult, await createResultDataInput(interpreter)))['id'];
	const tournament = interpreter.tournament;
	const tournamentID = (await keepTryingUntilItWorks(addTournament, await createTournamentDataInput(tournament, resultID)))['id'];
	// @ts-ignore
	for (const event of tournament.events) {
		await keepTryingUntilItWorks(addTournamentEvent, await createTournamentEventDataInput(event, tournamentID));
	}
	// @ts-ignore
	for (const track of tournament.tracks) {
		await keepTryingUntilItWorks(addTrack, await createTrackDataInput(track, tournamentID));
	}
	// @ts-ignore
	for (const team of tournament.teams) {
		await keepTryingUntilItWorks(addTeam, await createTeamDataInput(team, tournamentID));
	}
	// @ts-ignore
	for (const placing of tournament.placings) {
		// @ts-ignore
		const placingOutput = await addPlacing(await createPlacingDataInput(placing, tournamentID));
		if (placing.raw !== undefined) {
			keepTryingUntilItWorks(addRaw, await createRawDataInput(placing.raw, placingOutput.eventId, placingOutput.teamId, placingOutput.id));
		}
	}
	// @ts-ignore
	for (const penalty of tournament.penalties) {
		// @ts-ignore
		await keepTryingUntilItWorks(addPenalty, await createPenaltyDataInput(penalty, tournamentID));
	}
	if (interpreter.histograms !== undefined) {
		const histogramID = (await keepTryingUntilItWorks(addHistogram, await createHistogramDataInput(interpreter.histograms, tournamentID)))['id'];
		for (const event of interpreter.events) {
			const eventID = (await getEvent(event.name))['id'];
			const tournamentEventID = (await getTournamentEvent(tournamentID, eventID))['id'];
			keepTryingUntilItWorks(addHistoData, await createHistoDataDataInput(event.histograms, tournamentEventID, histogramID));
		}
	}
}
