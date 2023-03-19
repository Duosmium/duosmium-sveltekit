// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Interpreter from 'sciolyff/interpreter';
import { generateFilename } from './helpers';
import {
	addSchoolsFromInterpreter,
	deleteAllSchools,
	removeTournamentFromAllSchools
} from '$lib/schools/async';
import { load } from 'js-yaml';
import {
	addEventsFromInterpreter,
	deleteAllEvents,
	removeTournamentFromAllEvents
} from '$lib/events/async';
import { MONGO_ID_REGEX } from '$lib/global/helpers';
import { supabase } from "../global/supabase";
import { getInterpreter } from "./interpreter";
import { addTournament } from "../tournaments/async";

const table = "Result";

export async function getResult(id: string): Promise<object> {

}

export async function resultExists(id: string): Promise<boolean> {

}

export async function deleteResult(id: string) {

}

export async function deleteAllResults() {

}

export async function addResultFromYAMLFile(file: File) {
	const yaml = await file.text();
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const obj: object = load(yaml);
	await addResult(getInterpreter(obj));
}

export async function addResult(interpreter: Interpreter) {
	const duosmiumID = generateFilename(interpreter);
	// TODO: logo, color
	await supabase.from(table).upsert({ id: duosmiumID });
	await addTournament(interpreter.tournament, duosmiumID);
	return duosmiumID;
}
