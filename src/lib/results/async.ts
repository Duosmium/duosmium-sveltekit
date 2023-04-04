/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

// @ts-ignore
import Interpreter from 'sciolyff/interpreter';
import { generateFilename } from './helpers';
import { load } from 'js-yaml';
import { getInterpreter } from './interpreter';
import { prisma } from "../global/prisma";

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
