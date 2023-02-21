import Interpreter from 'sciolyff/interpreter';

export function getInterpreter(yaml: string) {
	return new Interpreter(yaml);
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