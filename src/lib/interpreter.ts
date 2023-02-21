import type { Interpreter } from 'sciolyff/dist/src/interpreter/types';

const sciolyff = (await import("sciolyff")).default;

export function getInterpreter(yaml: string) {
	return new sciolyff.Interpreter(yaml);
}

export function getEventNames(interpreter: Interpreter) {
	const eventNames: string[] = [];
	interpreter.events.forEach((e) => eventNames.push(e.name));
	return eventNames;
}

export function getTeamNames(interpreter: Interpreter) {
	const teamNames: string[] = [];
	interpreter.teams.forEach((t) => teamNames.push(`${t.schoolAbbreviation ? t.schoolAbbreviation : t.school}${t.suffix ? ' ' + t.suffix : ''} (${t.city ? t.city + ',' : ''}${t.state})`))
	return teamNames;
}