/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

// @ts-ignore
import { Team } from 'sciolyff/interpreter';
import { prisma } from '../global/prisma';

export async function getTeam(duosmiumID: string, number: number) {
	return await prisma.team.findUniqueOrThrow({
		where: {
			tournamentDuosmiumId_number: {
				tournamentDuosmiumId: duosmiumID,
				number: number
			}
		}
	});
}

export async function teamExists(duosmiumID: string, number: number) {
	return (
		(await prisma.team.count({
			where: {
				tournamentDuosmiumId: duosmiumID,
				number: number
			}
		})) > 0
	);
}

export async function deleteTeam(duosmiumID: string, number: number) {
	return await prisma.team.delete({
		where: {
			tournamentDuosmiumId_number: {
				tournamentDuosmiumId: duosmiumID,
				number: number
			}
		}
	});
}

export async function deleteAllTeams() {
	return await prisma.team.deleteMany({});
}

export async function addTeam(teamData: object) {
	return await prisma.team.upsert({
		where: {
			tournamentDuosmiumId_number: {
				// @ts-ignore
				tournamentDuosmiumId: teamData.tournamentDuosmiumId,
				// @ts-ignore
				number: teamData.number
			}
		},
		// @ts-ignore
		create: teamData,
		// @ts-ignore
		update: teamData
	});
}

export async function createTeamDataInput(
	team: Team,
	duosmiumID: string
) {
	const locationData = {
		name: team.school,
		city: team.city === undefined ? "" : team.city,
		state: /^[ns]?[A-Z]{2}$/.test(team.state) ? team.state : "",
		country: /^[ns]?[A-Z]{2}$/.test(team.state) ? "United States" : team.state,
	};
	const output = {
		number: team.number,
		location: {
			connectOrCreate: {
				create: locationData,
				where: {
					name_city_state_country: locationData
				}
			}
		},
		rank: team.rank,
		trackRank: team.trackRank,
		points: team.points,
		trackPoints: team.trackPoints,
		earnedBid: team.earnedBid,
		// worstPlacingsToBeDropped can be calculated via queries
		trialEventPoints: team.trialEventPoints,
		trackTrialEventPoints: team.trackTrialEventPoints,
		medalCounts: team.medalCounts,
		trialEventMedalCounts: team.trialEventMedalCounts,
		trackMedalCounts: team.trackMedalCounts,
		trackTrialEventMedalCounts: team.trackTrialEventMedalCounts
	};
	if (team.track) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		output['track'] = {
			connectOrCreate: {
				where: {
					tournamentDuosmiumId_name: {
						name: team.track.name,
						tournamentDuosmiumId: duosmiumID
					}
				},
				create: {
					name: team.track.name,
					tournament: {
						connect: {
							resultDuosmiumId: duosmiumID
						}
					}
				}
			}
		};
	}
	return output;
}
