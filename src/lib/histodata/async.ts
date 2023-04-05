/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

// @ts-ignore
import { HistoData } from 'sciolyff/interpreter';
import { prisma } from '../global/prisma';
import { addHistogram, createHistogramDataInput, getHistogram } from "../histograms/async";

export async function getHistoData(duosmiumID: string, eventName: string) {
	return await prisma.histoData.findUniqueOrThrow({
		where: {
			histogramDuosmiumId_eventName: {
				histogramDuosmiumId: duosmiumID,
				eventName: eventName
			}
		}
	});
}

export async function histoDataExists(duosmiumID: string, eventName: string) {
	return (
		(await prisma.histoData.count({
			where: {
				histogramDuosmiumId: duosmiumID,
				eventName: eventName
			}
		})) > 0
	);
}

export async function deleteHistoData(duosmiumID: string, eventName: string) {
	return await prisma.histoData.delete({
		where: {
			histogramDuosmiumId_eventName: {
				histogramDuosmiumId: duosmiumID,
				eventName: eventName
			}
		}
	});
}

export async function deleteAllHistoDatas() {
	return await prisma.histoData.deleteMany({});
}

export async function addHistoData(histoDataData: object) {
	return await prisma.histoData.upsert({
		where: {
			// @ts-ignore
			eventId: histoDataData.event.connect.id
		},
		// @ts-ignore
		create: histoDataData,
		update: histoDataData
	});
}

export async function createHistoDataDataInput(histoData: HistoData, duosmiumID: string) {
	return {
		tournamentEvent: {
			connect: {
				tournamentDuosmiumId_eventName: {
					tournamentDuosmiumId: duosmiumID,
					eventName: histoData.event.name
				}
			}
		},
		start: histoData.start,
		width: histoData.width,
		counts: histoData.counts,
		info: histoData.info
	};
}
