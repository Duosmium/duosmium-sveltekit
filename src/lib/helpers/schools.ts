import { SCHOOL_STATES } from './misc';

// TODO: fix types in sciolyff
interface Team {
	school: string;
	schoolAbbreviation?: string;
	city?: string;
	state: string;
	suffix?: string;
}

export function isUnitedStates(state: string) {
	return Object.keys(SCHOOL_STATES).includes(state);
}

export function formatSchool(team: Team) {
	if (team.schoolAbbreviation) {
		return abbrSchool(team.schoolAbbreviation);
	}
	return abbrSchool(team.school);
}

export function abbrSchool(school: string) {
	return school
		.replace('Elementary School', 'Elementary')
		.replace(/Elementary[ /-]Middle School/, 'E.M.S.')
		.replace('Middle School', 'M.S.')
		.replace('Junior High School', 'J.H.S.')
		.replace(/Middle[ /-]High School/, 'M.H.S.')
		.replace(/Junior[ /-]Senior High School/, 'Jr./Sr. H.S.')
		.replace('High School', 'H.S.')
		.replace('Secondary School', 'Secondary')
		.replace('Saint ', 'St. ')
		.replace('Mount ', 'Mt. ');
}

export function fullSchoolName(team: Team) {
	return fullSchoolNameFromLocation(team.school, team.city, team.state);
}

export function fullSchoolNameFromLocation(school: string, city?: string, state?: string) {
	const location = city ? `(${city}, ${state})` : `(${state})`;
	return `${school} ${location}`;
}

export function fullTeamName(team: Team) {
	const location = team.city ? `(${team.city}, ${team.state})` : `(${team.state})`;
	return `${team.school} ${team.suffix ? team.suffix + ' ' : ''}${location}`;
}

export function schoolURL(team: Team) {
	let country = 'United States';
	let state = 'null';
	const city = team.city || 'null';
	const school = team.school;

	if (team.state && isUnitedStates(team.state)) {
		state = team.state;
	} else {
		country = team.state;
		state = 'null';
	}
	return [
		encodeURIComponent(country),
		encodeURIComponent(state),
		encodeURIComponent(city),
		encodeURIComponent(school)
	].join('/');
}
