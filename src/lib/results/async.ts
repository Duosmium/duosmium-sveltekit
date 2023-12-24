// noinspection ES6RedundantAwait

import { createEventDataInput } from '$lib/events/async';
import { createHistogramDataInput } from '$lib/histograms/async';
import { createPenaltyDataInput } from '$lib/penalties/async';
import { createPlacingDataInput } from '$lib/placings/async';
import { createBgColorFromImagePath } from '$lib/results/color';
import { createLogoPath } from '$lib/results/logo';
import { createTeamDataInput } from '$lib/teams/async';
import { createTournamentDataInput } from '$lib/tournaments/async';
import { createTrackDataInput } from '$lib/tracks/async';
import { load } from 'js-yaml';
// @ts-ignore
import Interpreter from 'sciolyff/interpreter';
import {
	dateString,
	fullTournamentTitle,
	fullTournamentTitleShort,
	generateFilename,
	tournamentTitle,
	tournamentTitleShort
} from './helpers';
import { getInterpreter } from './interpreter';
import { ResultsAddQueue } from './queue';
import { prisma } from '$lib/global/prisma';

export async function getResult(duosmiumID: string) {
	return await prisma.result.findUniqueOrThrow({
		where: {
			duosmium_id: duosmiumID
		}
	});
}

async function getCompleteResultData(duosmiumID: string) {
	const [tournamentData, eventData, trackData, teamData, placingData, penaltyData, histogramData] =
		await prisma.$transaction([
			prisma.tournament.findUnique({
				where: {
					result_duosmium_id: duosmiumID
				},
				select: {
					data: true
				}
			}),
			prisma.event.findMany({
				where: {
					result_duosmium_id: duosmiumID
				},
				select: {
					data: true
				},
				orderBy: {
					name: 'asc'
				}
			}),
			prisma.track.findMany({
				where: {
					result_duosmium_id: duosmiumID
				},
				select: {
					data: true
				},
				orderBy: {
					name: 'asc'
				}
			}),
			prisma.team.findMany({
				where: {
					result_duosmium_id: duosmiumID
				},
				orderBy: {
					number: 'asc'
				},
				select: {
					data: true
				}
			}),
			prisma.placing.findMany({
				where: {
					result_duosmium_id: duosmiumID
				},
				orderBy: [
					{
						team_number: 'asc'
					},
					{
						event_name: 'asc'
					}
				],
				select: {
					data: true
				}
			}),
			prisma.penalty.findMany({
				where: {
					result_duosmium_id: duosmiumID
				},
				orderBy: {
					team_number: 'asc'
				},
				select: {
					data: true
				}
			}),
			prisma.histogram.findUnique({
				where: {
					result_duosmium_id: duosmiumID
				},
				select: {
					data: true
				}
			})
		]);
	return [tournamentData, eventData, trackData, teamData, placingData, penaltyData, histogramData];
}

export async function getCompleteResult(duosmiumID: string) {
	// @ts-ignore
	const [tournamentData, eventData, trackData, teamData, placingData, penaltyData, histogramData] =
		await getCompleteResultData(duosmiumID);
	const output = {};
	if (tournamentData !== null) {
		// @ts-ignore
		output['Tournament'] = tournamentData.data;
	}
	// @ts-ignore
	if (eventData.length > 0) {
		// @ts-ignore
		output['Events'] = eventData.map((i) => i.data);
	}
	// @ts-ignore
	if (trackData.length > 0) {
		// @ts-ignore
		output['Tracks'] = trackData.map((i) => i.data);
	}
	// @ts-ignore
	if (teamData.length > 0) {
		// @ts-ignore
		output['Teams'] = teamData.map((i) => i.data);
	}
	// @ts-ignore
	if (placingData.length > 0) {
		// @ts-ignore
		output['Placings'] = placingData.map((i) => i.data);
	}
	// @ts-ignore
	if (penaltyData.length > 0) {
		// @ts-ignore
		output['Penalties'] = penaltyData.map((i) => i.data);
	}
	if (histogramData !== null) {
		// @ts-ignore
		output['Histograms'] = histogramData.data;
	}
	return output;
}

export async function getAllResults(ascending = true, limit = 0) {
	return await prisma.result.findMany({
		orderBy: [
			{
				duosmium_id: ascending ? 'asc' : 'desc'
			}
		],
		take: limit === 0 ? undefined : limit
	});
}

export async function getAllCompleteResults(ascending = true, limit = 0) {
	const output = {};
	for (const result of await getAllResults(ascending, limit)) {
		const duosmiumID = result.duosmium_id;
		// @ts-ignore
		output[duosmiumID] = await getCompleteResult(duosmiumID);
	}
	return output;
}

export async function resultExists(duosmiumID: string) {
	return (
		(await prisma.result.count({
			where: {
				duosmium_id: duosmiumID
			}
		})) > 0
	);
}

export async function deleteResult(duosmiumID: string) {
	return await prisma.result.delete({
		where: {
			duosmium_id: duosmiumID
		}
	});
}

export async function deleteAllResults() {
	return await prisma.result.deleteMany({});
}

export async function addResultFromYAMLFile(
	file: File,
	callback = function (name: string) {
		const q = ResultsAddQueue.getInstance();
		console.log(
			`Result ${name} added! There are ${q.running()} workers running. The queue length is ${q.length()}.`
		);
	}
) {
	const yaml = await file.text();
	// @ts-ignore
	const obj: object = load(yaml);
	const interpreter: Interpreter = getInterpreter(obj);
	const resultData: object = await createCompleteResultDataInput(interpreter);
	// console.log(resultData);
	try {
		// await keepTryingUntilItWorks(addResult, resultData);
		await addResult(resultData);
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
			duosmium_id: resultData['duosmium_id']
		},
		// @ts-ignore
		create: resultData,
		update: resultData
	});
}

export async function createResultDataInput(interpreter: Interpreter, logo: string | undefined, color: string | undefined) {
	const duosmiumID = generateFilename(interpreter);
	logo = logo ?? await createLogoPath(duosmiumID, undefined);
	color = color ?? await createBgColorFromImagePath(logo);
	const title = tournamentTitle(interpreter.tournament);
	const fullTitle = fullTournamentTitle(interpreter.tournament);
	const shortTitle = tournamentTitleShort(interpreter.tournament);
	const fullShortTitle = fullTournamentTitleShort(interpreter.tournament);
	const date = dateString(interpreter);
	const locationName = interpreter.tournament.location;
	const locationState = interpreter.tournament.state;
	return {
		logo: logo,
		color: color,
		title: title,
		full_title: fullTitle,
		short_title: shortTitle,
		full_short_title: fullShortTitle,
		date: date,
		location_name: locationName,
		location_city: '',
		location_state: locationState,
		location_country: 'United States',
		updated_at: new Date(),
		duosmium_id: duosmiumID
	};
}

export async function createCompleteResultDataInput(interpreter: Interpreter, logo: string | undefined = undefined, color: string | undefined = undefined) {
	const duosmiumID = generateFilename(interpreter);
	const tournamentData = await createTournamentDataInput(interpreter.tournament);
	const eventData = [];
	for (const event of interpreter.events) {
		const thisEventData = await createEventDataInput(event);
		eventData.push({
			create: thisEventData,
			where: {
				result_duosmium_id_name: {
					result_duosmium_id: duosmiumID,
					name: event.name
				}
			}
		});
	}
	const trackData = [];
	for (const track of interpreter.tracks) {
		const thisTrackData = await createTrackDataInput(track);
		trackData.push({
			create: thisTrackData,
			where: {
				result_duosmium_id_name: {
					result_duosmium_id: duosmiumID,
					name: track.name.toString()
				}
			}
		});
	}
	const teamData = [];
	for (const team of interpreter.teams) {
		const thisTeamData = await createTeamDataInput(team);
		teamData.push({
			create: thisTeamData,
			where: {
				result_duosmium_id_number: {
					result_duosmium_id: duosmiumID,
					number: team.number
				}
			}
		});
	}
	const placingData = [];
	for (const placing of interpreter.placings) {
		const thisPlacingData = await createPlacingDataInput(placing, duosmiumID);
		placingData.push({
			create: thisPlacingData,
			where: {
				result_duosmium_id_event_name_team_number: {
					result_duosmium_id: duosmiumID,
					event_name: placing.event?.name,
					team_number: placing.team?.number
				}
			}
		});
	}
	const penaltyData = [];
	for (const penalty of interpreter.penalties) {
		const thisPenaltyData = await createPenaltyDataInput(penalty, duosmiumID);
		penaltyData.push({
			create: thisPenaltyData,
			where: {
				result_duosmium_id_team_number: {
					result_duosmium_id: duosmiumID,
					team_number: penalty.team?.number
				}
			}
		});
	}
	const output = await createResultDataInput(interpreter, logo, color);
	output['tournament'] = {
		connectOrCreate: {
			create: tournamentData,
			where: {
				result_duosmium_id: duosmiumID
			}
		}
	};
	output['events'] = {
		connectOrCreate: eventData
	};
	output['tracks'] = {
		connectOrCreate: trackData
	};
	output['teams'] = {
		connectOrCreate: teamData
	};
	output['placings'] = {
		connectOrCreate: placingData
	};
	output['penalties'] = {
		connectOrCreate: penaltyData
	};
	if (interpreter.histograms) {
		// @ts-ignore
		output['histogram'] = {
			connectOrCreate: {
				create: await createHistogramDataInput(interpreter.histograms),
				where: {
					result_duosmium_id: duosmiumID
				}
			}
		};
	}
	return output;
}

export async function regenerateMetadata(duosmiumID: string) {
	const input = await createResultDataInput(getInterpreter(await getCompleteResult(duosmiumID)));
	return await prisma.result.update({ where: { duosmium_id: duosmiumID }, data: input });
}

export async function regenerateAllMetadata() {
	for (const result of await getAllResults()) {
		await regenerateMetadata(result.duosmium_id);
	}
}

export async function getRecentResults(ascending = true, limit = 0) {
	return await prisma.result.findMany({
		orderBy: [
			{
				duosmium_id: ascending ? 'asc' : 'desc'
			}
		],
		take: limit === 0 ? undefined : limit
	});
}
