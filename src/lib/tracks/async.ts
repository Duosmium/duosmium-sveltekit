/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

// @ts-ignore
import { Track } from 'sciolyff/interpreter';
import { prisma } from '../global/prisma';

export async function getTrack(tournamentID: number, name: string) {
	return await prisma.track.findUniqueOrThrow({
		where: {
			tournamentId_name: {
				tournamentId: tournamentID,
				name: name.toString()
			}
		}
	});
}

export async function trackExists(tournamentID: number, name: string) {
	return (
		(await prisma.track.count({
			where: {
				tournamentId: tournamentID,
				name: name.toString()
			}
		})) > 0
	);
}

export async function deleteTrack(tournamentID: number, name: string) {
	return await prisma.track.delete({
		where: {
			tournamentId_name: {
				tournamentId: tournamentID,
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
			tournamentId_name: {
				// @ts-ignore
				tournamentId: trackData.tournament.connect.id,
				// @ts-ignore
				name: trackData.name
			}
		},
		// @ts-ignore
		create: trackData,
		update: trackData
	});
}

export async function createTrackDataInput(track: Track, tournamentID: number) {
	return {
		tournament: {
			connect: {
				id: tournamentID
			}
		},
		name: track.name.toString(),
		medals: track.medals,
		trophies: track.trophies,
		maximumPlace: track.maximumPlace
	};
}
