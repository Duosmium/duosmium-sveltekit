/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

// @ts-ignore
import { Track } from 'sciolyff/interpreter';
import { prisma } from '../global/prisma';

export async function getTrack(duosmiumID: string, name: string) {
	return await prisma.track.findUniqueOrThrow({
		where: {
			resultDuosmiumId_name: {
				resultDuosmiumId: duosmiumID,
				name: name.toString()
			}
		}
	});
}

export async function getTrackData(duosmiumID: string) {
	const rawData = await prisma.track.findMany({
		where: {
			resultDuosmiumId: duosmiumID
		},
		orderBy: {
			name: 'asc'
		}
	});
	const output = [];
	for (const rawItem of rawData) {
		output.push(rawItem.data);
	}
	return output;
}

export async function trackExists(duosmiumID: string, name: string) {
	return (
		(await prisma.track.count({
			where: {
				resultDuosmiumId: duosmiumID,
				name: name.toString()
			}
		})) > 0
	);
}

export async function deleteTrack(duosmiumID: string, name: string) {
	return await prisma.track.delete({
		where: {
			resultDuosmiumId_name: {
				resultDuosmiumId: duosmiumID,
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
			resultDuosmiumId_name: {
				// @ts-ignore
				resultDuosmiumId: trackData.resultDuosmiumId,
				// @ts-ignore
				name: trackData.name.toString()
			}
		},
		// @ts-ignore
		create: trackData,
		update: trackData
	});
}

export async function createTrackDataInput(track: Track) {
	return {
		name: track.name.toString(),
		data: track.rep
	};
}
