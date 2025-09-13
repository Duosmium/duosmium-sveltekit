import type Interpreter from 'sciolyff/interpreter';
import type { Placing, Team, Tournament } from 'sciolyff/interpreter';

// // TODO: fix types in sciolyff
// interface Tournament {
// 	name: string;
// 	level: string;
// 	state: string;
// 	location: string;
// 	shortName?: string;
// }

export function tournamentTitle(tInfo: Tournament) {
	const expandStateName = (state: string) => {
		return state.replace('sCA', 'SoCal').replace('nCA', 'NorCal');
	};
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
			return `${tInfo.state.replace('sCA', 'SoCal').replace('nCA', 'NorCal')} State Tournament`;
		case 'Regionals':
		case 'Invitational':
			if (!tInfo.shortName) {
				const cut = tInfo.level === 'Regionals' ? 'Regional' : 'Invitational';
				const splits = tInfo.name.split(cut, 2)[0];
				return `${splits} ${cut}${cut === 'Regional' ? ' Tournament' : ''}`;
			}
			return tInfo.shortName;
	}
}

export function generateFilename(interpreter: Interpreter) {
	let output = '';
	output += interpreter.tournament.startDate?.getUTCFullYear();
	output +=
		'-' +
		((interpreter.tournament.startDate ?? new Date()).getUTCMonth() + 1)
			.toString()
			.padStart(2, '0');
	output +=
		'-' + (interpreter.tournament.startDate ?? new Date()).getUTCDate().toString().padStart(2, '0');
	switch (interpreter.tournament.level) {
		case 'Nationals':
			output += '_nationals';
			break;
		case 'States':
			output += `_${interpreter.tournament.state}_states`;
			break;
		case 'Regionals':
			output += `_${interpreter.tournament.state}_${(
				interpreter.tournament.shortName ??
				interpreter.tournament.name ??
				''
			)
				.toLowerCase()
				.split('regional')[0]
				.replace(/\./g, '')
				.replace(/[^\w]/g, '_')}regional`;
			break;
		default:
			output += `_${(interpreter.tournament.shortName ?? interpreter.tournament.name ?? '')
				.toLowerCase()
				.split('invitational')[0]
				.replace(/\./g, '')
				.replace(/[^\w]/g, '_')}invitational`;
			break;
	}
	output += '_' + interpreter.tournament.division.toLowerCase();
	return output;
}

export function getDateString(tournament: Tournament) {
	let output = tournament.startDate?.toLocaleDateString(undefined, {
		weekday: 'long',
		timeZone: 'UTC',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
	if (tournament.endDate > tournament.startDate) {
		output += ` — ${tournament.endDate?.toLocaleDateString(undefined, {
			weekday: 'long',
			timeZone: 'UTC',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})}`;
	}
	return output;
}

export function placingNotes(placing: Placing) {
	const place = placing.place;
	const points = placing.isolatedPoints;
	return [
		placing.event.trial ? 'trial event' : null,
		placing.event.trialed ? 'trialed event' : null,
		placing.disqualified ? 'disqualified' : null,
		placing.didNotParticipate ? 'did not participate' : null,
		placing.participationOnly ? 'participation points only' : null,
		placing.tie ? 'tie' : null,
		placing.exempt ? 'exempt' : null,
		placing.pointsLimitedByMaximumPlace ? 'points limited' : null,
		placing.unknown ? 'unknown place' : null,
		placing.pointsAffectedByExhibition && place - points == 1
			? 'placed behind exhibition team'
			: null,
		placing.pointsAffectedByExhibition && place - points > 1
			? 'placed behind exhibition teams'
			: null,
		placing.droppedAsPartOfWorstPlacings ? 'dropped' : null
	]
		.flatMap((s) => (s ? [s[0].toUpperCase() + s.slice(1)] : []))
		.join(', ');
}

export function supTag(placing: Placing) {
	const exempt = placing.exempt || placing.droppedAsPartOfWorstPlacings;
	const tie = placing.tie && !placing.pointsLimitedByMaximumPlace;
	if (tie || exempt) {
		return `<sup>${exempt ? '◊' : ''}${tie ? '*' : ''}</sup>`;
	}
	return '';
}

export function bidsSupTag(team: Team) {
	return team.earnedBid ? '<sup>✧</sup>' : '';
}

export function bidsSupTagNote(tournament: Tournament) {
	const nextTournament =
		tournament.level === 'Regionals'
			? `${tournament.state.replace('sCA', 'SoCal').replace('nCA', 'NorCal')} State Tournament`
			: 'National Tournament';
	const qualifiee = tournament.bidsPerSchool > 1 ? 'team' : 'school';
	return `Qualified ${qualifiee} for the ${tournament.year} ${nextTournament}`;
}
