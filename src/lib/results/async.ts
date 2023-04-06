/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

// @ts-ignore
import Interpreter from 'sciolyff/interpreter';
import { generateFilename } from './helpers';
import { load } from 'js-yaml';
import { getInterpreter } from './interpreter';
import { keepTryingUntilItWorks, prisma } from "../global/prisma";
import { createTournamentDataInput } from "../tournaments/async";
import { createHistogramDataInput } from "../histograms/async";
import { ResultsAddQueue } from "./queue";

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

export async function addResultFromYAMLFile(file: File, callback=function (name: string) {
	const q = ResultsAddQueue.getInstance();
	console.log(`Result ${name} added! There are ${q.running()} workers running. The queue length is ${q.length()}.`);
}) {
	const yaml = await file.text();
	// @ts-ignore
	const obj: object = load(yaml);
	const interpreter: Interpreter = getInterpreter(obj);
	try {
		await keepTryingUntilItWorks(addResult, await createResultDataInput(interpreter));
		callback(generateFilename(interpreter));
	} catch (e) {
		console.log(`ERROR: could not add ${generateFilename(interpreter)}!`);
		console.log(e);
	}
}

export async function addResult(resultData: object) {
	return await prisma.result.upsert({
		where: {
			// @ts-ignore
			duosmiumId: resultData["duosmiumId"]
		},
		// @ts-ignore
		create: resultData,
		update: resultData
	});
}

export async function createResultDataInput(interpreter: Interpreter) {
	const duosmiumID = generateFilename(interpreter);
	const tournamentData = await createTournamentDataInput(interpreter.tournament, duosmiumID);
	const output = {
		duosmiumId: duosmiumID,
		tournament: {
			connectOrCreate: {
				create: tournamentData,
				where: {
					resultDuosmiumId: duosmiumID
				}
			}
		}
	};
	if (interpreter.histograms) {
		// @ts-ignore
		output["histogram"] = {
			connectOrCreate: {
				create: await createHistogramDataInput(interpreter.histograms, duosmiumID),
				where: {
					resultDuosmiumId: duosmiumID
				}
			}
		}
	}
	return output;
}
