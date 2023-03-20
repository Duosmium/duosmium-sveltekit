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
				name: name
			}
		}
	});
}

export async function trackExists(tournamentID: number, name: string) {
	return (
		(await prisma.track.count({
			where: {
				tournamentId: tournamentID,
				name: name
			}
		})) > 0
	);
}

export async function deleteTrack(tournamentID: number, name: string) {
	return await prisma.track.delete({
		where: {
			tournamentId_name: {
				tournamentId: tournamentID,
				name: name
			}
		}
	});
}

export async function deleteAllTracks() {
	return await prisma.track.deleteMany({});
}

export async function addTrack(track: Track, tournamentID: number) {
	const trackData = createDataInput(track, tournamentID);
	return await prisma.track.upsert({
		where: {
			tournamentId_name: {
				tournamentId: tournamentID,
				name: track.name
			}
		},
		// @ts-ignore
		create: trackData,
		update: trackData
	});
}

function createDataInput(track: Track, tournamentID: number) {
	return {
		tournamentId: tournamentID,
		name: track.name,
		medals: track.medals,
		trophies: track.trophies,
		maximumPlace: track.maximumPlace
	};
}
