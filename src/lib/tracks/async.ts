/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

// @ts-ignore
import { Track } from 'sciolyff/interpreter';
import { prisma } from '../global/prisma';

export async function getTrack(duosmiumID: string, name: string) {
	return await prisma.track.findUniqueOrThrow({
		where: {
			tournamentDuosmiumId_name: {
				tournamentDuosmiumId: duosmiumID,
				name: name.toString()
			}
		}
	});
}

export async function trackExists(duosmiumID: string, name: string) {
	return (
		(await prisma.track.count({
			where: {
				tournamentDuosmiumId: duosmiumID,
				name: name.toString()
			}
		})) > 0
	);
}

export async function deleteTrack(duosmiumID: string, name: string) {
	return await prisma.track.delete({
		where: {
			tournamentDuosmiumId_name: {
				tournamentDuosmiumId: duosmiumID,
				name: name.toString()
			}
		}
	});
}

export async function deleteAllTracks() {
	return await prisma.track.deleteMany({});
}

export async function addTrack(trackData: object) {
	return await prisma.track.upsert({
		where: {
			tournamentDuosmiumId_name: {
				// @ts-ignore
				tournamentDuosmiumId: trackData.tournamentDuosmiumId,
				// @ts-ignore
				name: trackData.name.toString()
			}
		},
		// @ts-ignore
		create: trackData,
		update: trackData
	});
}

export async function createTrackDataInput(track: Track, duosmiumID: string) {
	return {
		tournament: {
			connect: {
				resultDuosmiumId: duosmiumID
			}
		},
		name: track.name.toString(),
		medals: track.medals,
		trophies: track.trophies,
		maximumPlace: track.maximumPlace
	};
}
