/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

// @ts-ignore
import { Histogram } from 'sciolyff/interpreter';
import { prisma } from '../global/prisma';

export async function getHistogram(tournamentID: number) {
	return await prisma.histogram.findUniqueOrThrow({
		where: {
			tournamentId: tournamentID
		}
	});
}

export async function histogramExists(tournamentID: number) {
	return (
		(await prisma.histogram.count({
			where: {
				tournamentId: tournamentID
			}
		})) > 0
	);
}

export async function deleteHistogram(tournamentID: number) {
	return await prisma.histogram.delete({
		where: {
			tournamentId: tournamentID
		}
	});
}

export async function deleteAllHistograms() {
	return await prisma.histogram.deleteMany({});
}

export async function addHistogram(histogramData: object) {
	return await prisma.histogram.upsert({
		where: {
			// @ts-ignore
			tournamentId: histogramData.tournament.connect.id
		},
		// @ts-ignore
		create: histogramData,
		update: histogramData
	});
}

export async function createHistogramDataInput(histogram: Histogram, tournamentID: number) {
	return {
		tournament: {
			connect: {
				id: tournamentID
			}
		},
		type: histogram.type,
		url: histogram.url
	};
}
