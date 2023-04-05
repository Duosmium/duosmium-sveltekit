/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

// @ts-ignore
import { Histogram } from 'sciolyff/interpreter';
import { prisma } from '../global/prisma';
import { createHistoDataDataInput } from "../histodata/async";

export async function getHistogram(duosmiumID: string) {
	return await prisma.histogram.findUniqueOrThrow({
		where: {
			resultDuosmiumId: duosmiumID
		}
	});
}

export async function histogramExists(duosmiumID: string) {
	return (
		(await prisma.histogram.count({
			where: {
				resultDuosmiumId: duosmiumID
			}
		})) > 0
	);
}

export async function deleteHistogram(duosmiumID: string) {
	return await prisma.histogram.delete({
		where: {
			resultDuosmiumId: duosmiumID
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

export async function createHistogramDataInput(histogram: Histogram, duosmiumID: string) {
	const histoDataObjects = [];
	for (const data of histogram.data) {
		const thisHistoDataObject = await createHistoDataDataInput(data, duosmiumID);
		histoDataObjects.push({
			create: thisHistoDataObject,
			where: {
				histogramDuosmiumId_eventName: {
					histogramDuosmiumId: duosmiumID,
					eventName: data.event.name
				}
			}
		})
	}
	return {
		type: histogram.type,
		url: histogram.url,
		data: {
			connectOrCreate: histoDataObjects
		}
	};
}
