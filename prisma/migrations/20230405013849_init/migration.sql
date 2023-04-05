/*
  Warnings:

  - You are about to drop the column `tournamentDuosmiumId` on the `HistoData` table. All the data in the column will be lost.
  - You are about to drop the column `tournamentDuosmiumId` on the `Histogram` table. All the data in the column will be lost.
  - You are about to drop the column `histogramId` on the `Tournament` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[histogramDuosmiumId,eventName]` on the table `HistoData` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resultDuosmiumId]` on the table `Histogram` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `histogramDuosmiumId` to the `HistoData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resultDuosmiumId` to the `Histogram` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."HistoData" DROP CONSTRAINT "HistoData_tournamentDuosmiumId_eventName_fkey";

-- DropForeignKey
ALTER TABLE "public"."HistoData" DROP CONSTRAINT "HistoData_tournamentDuosmiumId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Histogram" DROP CONSTRAINT "Histogram_tournamentDuosmiumId_fkey";

-- DropIndex
DROP INDEX "public"."HistoData_tournamentDuosmiumId_eventName_idx";

-- DropIndex
DROP INDEX "public"."HistoData_tournamentDuosmiumId_eventName_key";

-- DropIndex
DROP INDEX "public"."Histogram_tournamentDuosmiumId_idx";

-- DropIndex
DROP INDEX "public"."Histogram_tournamentDuosmiumId_key";

-- AlterTable
ALTER TABLE "public"."HistoData" DROP COLUMN "tournamentDuosmiumId",
ADD COLUMN     "histogramDuosmiumId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Histogram" DROP COLUMN "tournamentDuosmiumId",
ADD COLUMN     "resultDuosmiumId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Tournament" DROP COLUMN "histogramId";

-- CreateIndex
CREATE INDEX "HistoData_histogramDuosmiumId_eventName_idx" ON "public"."HistoData"("histogramDuosmiumId" ASC, "eventName" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "HistoData_histogramDuosmiumId_eventName_key" ON "public"."HistoData"("histogramDuosmiumId", "eventName");

-- CreateIndex
CREATE UNIQUE INDEX "Histogram_resultDuosmiumId_key" ON "public"."Histogram"("resultDuosmiumId");

-- CreateIndex
CREATE INDEX "Histogram_resultDuosmiumId_idx" ON "public"."Histogram"("resultDuosmiumId" ASC);

-- AddForeignKey
ALTER TABLE "public"."HistoData" ADD CONSTRAINT "HistoData_histogramDuosmiumId_fkey" FOREIGN KEY ("histogramDuosmiumId") REFERENCES "public"."Histogram"("resultDuosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HistoData" ADD CONSTRAINT "HistoData_histogramDuosmiumId_eventName_fkey" FOREIGN KEY ("histogramDuosmiumId", "eventName") REFERENCES "public"."TournamentEvent"("tournamentDuosmiumId", "eventName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Histogram" ADD CONSTRAINT "Histogram_resultDuosmiumId_fkey" FOREIGN KEY ("resultDuosmiumId") REFERENCES "public"."Result"("duosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;
