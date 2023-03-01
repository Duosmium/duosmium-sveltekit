import { dump } from 'js-yaml';
import type { Team, Tournament, Interpreter } from 'sciolyff/dist/src/interpreter/types';
import strftime from 'strftime';

export function objectToYAML(obj: object) {
	return dump(obj).replace('T00:00:00.000Z', '');
}

const STATES_BY_POSTAL_CODE: object = {
	AL: 'Alabama',
	AK: 'Alaska',
	AZ: 'Arizona',
	AR: 'Arkansas',
	CA: 'California',
	nCA: 'Northern California',
	sCA: 'Southern California',
	CO: 'Colorado',
	CT: 'Connecticut',
	DE: 'Delaware',
	DC: 'District of Columbia',
	FL: 'Florida',
	GA: 'Georgia',
	HI: 'Hawaii',
	ID: 'Idaho',
	IL: 'Illinois',
	IN: 'Indiana',
	IA: 'Iowa',
	KS: 'Kansas',
	KY: 'Kentucky',
	LA: 'Louisiana',
	ME: 'Maine',
	MD: 'Maryland',
	MA: 'Massachusetts',
	MI: 'Michigan',
	MN: 'Minnesota',
	MS: 'Mississippi',
	MO: 'Missouri',
	MT: 'Montana',
	NE: 'Nebraska',
	NV: 'Nevada',
	NH: 'New Hampshire',
	NJ: 'New Jersey',
	NM: 'New Mexico',
	NY: 'New York',
	NC: 'North Carolina',
	ND: 'North Dakota',
	OH: 'Ohio',
	OK: 'Oklahoma',
	OR: 'Oregon',
	PA: 'Pennsylvania',
	RI: 'Rhode Island',
	SC: 'South Carolina',
	SD: 'South Dakota',
	TN: 'Tennessee',
	TX: 'Texas',
	UT: 'Utah',
	VT: 'Vermont',
	VA: 'Virginia',
	WA: 'Washington',
	WV: 'West Virginia',
	WI: 'Wisconsin',
	WY: 'Wyoming'
};

function expandStateName(postalCode: string | undefined) {
	if (postalCode === undefined) {
		throw new Error('Postal code is undefined!');
	}
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return STATES_BY_POSTAL_CODE[postalCode];
}

export function generateFilename(interpreter: Interpreter) {
	if (interpreter.tournament.startDate === undefined) {
		throw new Error('Tournament has no start date!');
	}
	const relevantString = getRelevantString(interpreter);
	let output = '';
	output += interpreter.tournament.startDate.getFullYear();
	output += '-' + (interpreter.tournament.startDate.getUTCMonth() + 1).toString().padStart(2, '0');
	output += '-' + interpreter.tournament.startDate.getUTCDate().toString().padStart(2, '0');
	switch (interpreter.tournament.level) {
		case 'Nationals':
			output += '_nationals';
			break;
		case 'States':
			output += `_${interpreter.tournament.state}_states`;
			break;
		case 'Regionals':
			output += `_${interpreter.tournament.state}_${relevantString
				.toLowerCase()
				.split('regional')[0]
				.replace(/\./g, '')
				.replace(/[^A-Za-z0-9-]/g, '_')}regional`;
			break;
		default:
			output += `_${relevantString
				.toLowerCase()
				.split('invitational')[0]
				.replace(/\./g, '')
				.replace(/[^A-Za-z0-9-]/g, '_')}invitational`;
			break;
	}
	output += '_' + interpreter.tournament.division.toLowerCase();
	return output;
}

export function tournamentTitle(tInfo: Tournament) {
	if (tInfo.name) return tInfo.name;

	switch (tInfo.level) {
		case 'Nationals':
			return 'Science Olympiad National Tournament';
		case 'States':
			return `${expandStateName(tInfo.state)} Science Olympiad State Tournament`;
		case 'Regionals':
			return `${tInfo.location} Regional Tournament`;
		case 'Invitational':
			return `${tInfo.location} Invitational`;
	}
}

export function tournamentTitleShort(tInfo: Tournament) {
	switch (tInfo.level) {
		case 'Nationals':
			return 'National Tournament';
		case 'States':
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			return `${tInfo.state.replace('sCA', 'SoCal').replace('nCA', 'NorCal')} State Tournament`;
		case 'Regionals':
		case 'Invitational':
			if (!tInfo.shortName && tInfo.name) {
				const cut = tInfo.level === 'Regionals' ? 'Regional' : 'Invitational';
				const splits = tInfo.name.split(cut, 2)[0];
				return `${splits} ${cut}${cut === 'Regional' ? ' Tournament' : ''}`;
			}
			return tInfo.shortName;
	}
}

export function formatSchool(team: Team) {
	if (team.schoolAbbreviation) {
		return abbrSchool(team.schoolAbbreviation);
	}
	return abbrSchool(team.school);
}

function abbrSchool(school: string) {
	return school
		// .replace('Elementary School', 'Elementary')
		.replace('Elementary School', 'E.S.')
		.replace('Elementary/Middle School', 'E.M.S.')
		.replace('Middle School', 'M.S.')
		.replace('Junior High School', 'J.H.S.')
		.replace(/Middle[ /-]High School/, 'M.H.S')
		.replace('Junior/Senior High School', 'Jr./Sr. H.S.')
		.replace('High School', 'H.S.')
		// .replace('Secondary School', 'Secondary');
		.replace('Secondary School', 'S.S.');
}

function fullSchoolName(team: Team) {
	const location = team.city ? `(${team.city}, ${team.state})` : `(${team.state})`;
	return `${team.school} ${location}`;
}

function fullTeamName(team: Team) {
	const location = team.city ? `(${team.city}, ${team.state})` : `(${team.state})`;
	return `${team.school} ${team.suffix ? team.suffix + ' ' : ''}${location}`;
}

// from https://stackoverflow.com/questions/13627308/
export const ordinalize = (i: number) => {
	const j = i % 10,
		k = i % 100;
	if (j == 1 && k != 11) {
		return i + 'st';
	}
	if (j == 2 && k != 12) {
		return i + 'nd';
	}
	if (j == 3 && k != 13) {
		return i + 'rd';
	}
	return i + 'th';
};

export function dateString(i: Interpreter): string {
	if (i.tournament.startDate && i.tournament.endDate) {
		let s = strftime('%A, %B %d, %Y', i.tournament.startDate);
		const e = strftime('%A, %B %d, %Y', i.tournament.endDate);
		if (s != e) {
			s += ' - ' + e;
		}
		return s;
	}
	return 'Your date is broken.';
}

function getRelevantString(i: Interpreter): string {
	if (i.tournament.name === undefined && i.tournament.shortName === undefined) {
		throw new Error('Tournament has neither a name nor a short name!');
	} else if (i.tournament.name !== undefined && i.tournament.shortName === undefined) {
		return i.tournament.name;
	} else if (i.tournament.name !== undefined && i.tournament.shortName !== undefined) {
		return i.tournament.shortName;
	}
	return '';
}
