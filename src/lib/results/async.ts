/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

// @ts-ignore
import Interpreter from 'sciolyff/interpreter';
import { generateFilename } from './helpers';
import { load } from 'js-yaml';
import { getInterpreter } from './interpreter';
import { addTournament } from '../tournaments/async';
import { prisma } from '../global/prisma';
import { addHistogram } from "../histograms/async";
import { addHistoData } from "../histodata/async";
import { getTournamentEvent } from "../tournamentevents/async";
import { getEvent } from "../events/async";

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
	await addResult(getInterpreter(obj));
}

export async function addResult(interpreter: Interpreter) {
	const duosmiumID = generateFilename(interpreter);
	console.log(`Adding result ${duosmiumID} at ${new Date()}`);
	// TODO: logo, color
	const resultOutput = await prisma.result.upsert({
		where: {
			duosmiumId: duosmiumID
		},
		create: {
			duosmiumId: duosmiumID
		},
		update: {
			duosmiumId: duosmiumID
		}
	});
	const resultID = resultOutput['id'];
	const tournamentID = (await addTournament(interpreter.tournament, resultID))['id'];
	if (interpreter.histograms !== undefined) {
		const histogramID = (await addHistogram(interpreter.histograms, tournamentID))['id'];
		for (const event of interpreter.events) {
			const eventID = (await getEvent(event.name))['id'];
			const tournamentEventID = (await getTournamentEvent(tournamentID, eventID))['id'];
			await addHistoData(event.histograms, tournamentEventID, histogramID);
		}
	}
	console.log(`Added result ${duosmiumID} at ${new Date()}`);
	return resultOutput;
}
