// noinspection ES6RedundantAwait

// @ts-ignore
import { Histogram } from 'sciolyff/interpreter';
import { prisma } from '$lib/global/prisma';

export async function getHistogram(duosmiumID: string) {
	return await prisma.histogram.findUniqueOrThrow({
		where: {
			result_duosmium_id: duosmiumID
		}
	});
}

export async function getHistogramData(duosmiumID: string) {
	const rawData = await prisma.histogram.findUnique({
		where: {
			result_duosmium_id: duosmiumID
		}
	});
	if (rawData === null) {
		return null;
	} else {
		return rawData.data;
	}
}

export async function histogramExists(duosmiumID: string) {
	return (
		(await prisma.histogram.count({
			where: {
				result_duosmium_id: duosmiumID
			}
		})) > 0
	);
}

export async function deleteHistogram(duosmiumID: string) {
	return await prisma.histogram.delete({
		where: {
			result_duosmium_id: duosmiumID
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
			result_duosmium_id: histogramData.result_duosmium_id
		},
		// @ts-ignore
		create: histogramData,
		update: histogramData
	});
}

export async function createHistogramDataInput(histogram: Histogram, duosmiumID: string) {
	return {
		data: histogram.rep,
		result_duosmium_id: duosmiumID
	};
}
