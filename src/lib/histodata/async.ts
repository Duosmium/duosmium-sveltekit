/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

// @ts-ignore
import { HistoData } from 'sciolyff/interpreter';
import { prisma } from '../global/prisma';
import { addHistogram, createHistogramDataInput, getHistogram } from "../histograms/async";

export async function getHistoData(eventID: number) {
	return await prisma.histoData.findUniqueOrThrow({
		where: {
			eventId: eventID
		}
	});
}

export async function histoDataExists(eventID: number) {
	return (
		(await prisma.histoData.count({
			where: {
				eventId: eventID
			}
		})) > 0
	);
}

export async function deleteHistoData(eventID: number) {
	return await prisma.histoData.delete({
		where: {
			eventId: eventID
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

export async function createHistoDataDataInput(histoData: HistoData, tournamentID: number, eventID: number) {
	let parentID;
	try {
		parentID = (await getHistogram(tournamentID))['id'];
	} catch (e) {
		parentID = (await addHistogram(await createHistogramDataInput(histoData.parent, tournamentID)))['id'];
	}
	return {
		event: {
			connect: {
				id: eventID
			}
		},
		parent: {
			connect: {
				id: parentID
			}
		},
		start: histoData.start,
		width: histoData.width,
		counts: histoData.counts,
		info: histoData.info
	};
}
