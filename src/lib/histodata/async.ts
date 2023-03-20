/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

// @ts-ignore
import { HistoData } from "sciolyff/interpreter";
import { prisma } from '../global/prisma';

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

export async function addHistoData(
  histoData: HistoData,
  eventID: number,
  parentID: number
) {
  const histoDataData = createDataInput(histoData, eventID, parentID);
  return await prisma.histoData.upsert({
    where: {
      eventId: eventID
    },
    // @ts-ignore
    create: histoDataData,
    update: histoDataData
  });
}

function createDataInput(
  histoData: HistoData,
  eventID: number,
  parentID: number
) {
  return {
    eventId: eventID,
    parentId: parentID,
    start: histoData.start,
    width: histoData.width,
    counts: histoData.counts,
    info: histoData.info
  };
}
