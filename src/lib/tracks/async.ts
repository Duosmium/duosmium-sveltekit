// noinspection ES6RedundantAwait

// @ts-ignore
import { Track } from 'sciolyff/interpreter';
import { prisma } from '$lib/global/prisma';

export async function getTrack(duosmiumID: string, name: string) {
	return await prisma.track.findUniqueOrThrow({
		where: {
			result_duosmium_id_name: {
				result_duosmium_id: duosmiumID,
				name: name.toString()
			}
		}
	});
}

export async function getTrackData(duosmiumID: string) {
	const rawData = await prisma.track.findMany({
		where: {
			result_duosmium_id: duosmiumID
		},
		orderBy: {
			name: 'asc'
		},
		select: {
			data: true
		}
	});
	return rawData.map((i) => i.data);
}

export async function trackExists(duosmiumID: string, name: string) {
	return (
		(await prisma.track.count({
			where: {
				result_duosmium_id: duosmiumID,
				name: name.toString()
			}
		})) > 0
	);
}

export async function deleteTrack(duosmiumID: string, name: string) {
	return await prisma.track.delete({
		where: {
			result_duosmium_id_name: {
				result_duosmium_id: duosmiumID,
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
			result_duosmium_id_name: {
				// @ts-ignore
				result_duosmium_id: trackData.result_duosmium_id,
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
