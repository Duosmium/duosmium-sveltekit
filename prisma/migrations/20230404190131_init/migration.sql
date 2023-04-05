/*
  Warnings:

  - You are about to drop the column `parentId` on the `HistoData` table. All the data in the column will be lost.
  - You are about to drop the column `tournamentEventId` on the `HistoData` table. All the data in the column will be lost.
  - You are about to drop the column `tournamentId` on the `Histogram` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Penalty` table. All the data in the column will be lost.
  - You are about to drop the column `tournamentId` on the `Penalty` table. All the data in the column will be lost.
  - You are about to drop the column `trackId` on the `Penalty` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Placing` table. All the data in the column will be lost.
  - You are about to drop the column `tournamentEventId` on the `Placing` table. All the data in the column will be lost.
  - You are about to drop the column `tournamentId` on the `Placing` table. All the data in the column will be lost.
  - You are about to drop the column `trackId` on the `Placing` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Raw` table. All the data in the column will be lost.
  - You are about to drop the column `tournamentEventId` on the `Raw` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `tournamentId` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `trackId` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `resultId` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `TournamentEvent` table. All the data in the column will be lost.
  - You are about to drop the column `tournamentId` on the `TournamentEvent` table. All the data in the column will be lost.
  - You are about to drop the column `tournamentId` on the `Track` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tournamentDuosmiumId,eventName]` on the table `HistoData` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tournamentDuosmiumId]` on the table `Histogram` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,city,state,country]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tournamentDuosmiumId,teamNumber]` on the table `Penalty` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tournamentDuosmiumId,eventName,teamNumber]` on the table `Placing` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tournamentDuosmiumId,eventName,teamNumber]` on the table `Raw` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tournamentDuosmiumId,number]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resultDuosmiumId]` on the table `Tournament` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tournamentDuosmiumId,eventName]` on the table `TournamentEvent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tournamentDuosmiumId,name]` on the table `Track` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventName` to the `HistoData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tournamentDuosmiumId` to the `HistoData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tournamentDuosmiumId` to the `Histogram` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamNumber` to the `Penalty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tournamentDuosmiumId` to the `Penalty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventName` to the `Placing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamNumber` to the `Placing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tournamentDuosmiumId` to the `Placing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventName` to the `Raw` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamNumber` to the `Raw` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tournamentDuosmiumId` to the `Raw` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationCity` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationName` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationState` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tournamentDuosmiumId` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationCity` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationName` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationState` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventName` to the `TournamentEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tournamentDuosmiumId` to the `TournamentEvent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."HistoData" DROP CONSTRAINT "HistoData_parentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."HistoData" DROP CONSTRAINT "HistoData_tournamentEventId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Histogram" DROP CONSTRAINT "Histogram_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Penalty" DROP CONSTRAINT "Penalty_teamId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Penalty" DROP CONSTRAINT "Penalty_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Penalty" DROP CONSTRAINT "Penalty_trackId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Placing" DROP CONSTRAINT "Placing_teamId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Placing" DROP CONSTRAINT "Placing_tournamentEventId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Placing" DROP CONSTRAINT "Placing_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Placing" DROP CONSTRAINT "Placing_trackId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Raw" DROP CONSTRAINT "Raw_placingId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Raw" DROP CONSTRAINT "Raw_teamId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Raw" DROP CONSTRAINT "Raw_tournamentEventId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Team" DROP CONSTRAINT "Team_locationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Team" DROP CONSTRAINT "Team_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Team" DROP CONSTRAINT "Team_trackId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Tournament" DROP CONSTRAINT "Tournament_locationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Tournament" DROP CONSTRAINT "Tournament_resultId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TournamentEvent" DROP CONSTRAINT "TournamentEvent_eventId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TournamentEvent" DROP CONSTRAINT "TournamentEvent_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Track" DROP CONSTRAINT "Track_tournamentId_fkey";

-- DropIndex
DROP INDEX "public"."HistoData_tournamentEventId_key";

-- DropIndex
DROP INDEX "public"."Histogram_tournamentId_key";

-- DropIndex
DROP INDEX "public"."Location_name_city_state_key";

-- DropIndex
DROP INDEX "public"."Penalty_tournamentId_teamId_key";

-- DropIndex
DROP INDEX "public"."Placing_tournamentEventId_teamId_key";

-- DropIndex
DROP INDEX "public"."Team_tournamentId_number_key";

-- DropIndex
DROP INDEX "public"."Tournament_resultId_key";

-- DropIndex
DROP INDEX "public"."TournamentEvent_tournamentId_eventId_key";

-- DropIndex
DROP INDEX "public"."Track_tournamentId_name_key";

-- AlterTable
ALTER TABLE "public"."HistoData" DROP COLUMN "parentId",
DROP COLUMN "tournamentEventId",
ADD COLUMN     "eventName" TEXT NOT NULL,
ADD COLUMN     "tournamentDuosmiumId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Histogram" DROP COLUMN "tournamentId",
ADD COLUMN     "tournamentDuosmiumId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Location" ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'United States',
ALTER COLUMN "city" SET DEFAULT '';

-- AlterTable
ALTER TABLE "public"."Penalty" DROP COLUMN "teamId",
DROP COLUMN "tournamentId",
DROP COLUMN "trackId",
ADD COLUMN     "teamNumber" INTEGER NOT NULL,
ADD COLUMN     "tournamentDuosmiumId" TEXT NOT NULL,
ADD COLUMN     "trackName" TEXT;

-- AlterTable
ALTER TABLE "public"."Placing" DROP COLUMN "teamId",
DROP COLUMN "tournamentEventId",
DROP COLUMN "tournamentId",
DROP COLUMN "trackId",
ADD COLUMN     "eventName" TEXT NOT NULL,
ADD COLUMN     "teamNumber" INTEGER NOT NULL,
ADD COLUMN     "tournamentDuosmiumId" TEXT NOT NULL,
ADD COLUMN     "trackName" TEXT;

-- AlterTable
ALTER TABLE "public"."Raw" DROP COLUMN "teamId",
DROP COLUMN "tournamentEventId",
ADD COLUMN     "eventName" TEXT NOT NULL,
ADD COLUMN     "teamNumber" INTEGER NOT NULL,
ADD COLUMN     "tournamentDuosmiumId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Team" DROP COLUMN "locationId",
DROP COLUMN "tournamentId",
DROP COLUMN "trackId",
ADD COLUMN     "locationCity" TEXT NOT NULL,
ADD COLUMN     "locationCountry" TEXT NOT NULL DEFAULT 'United States',
ADD COLUMN     "locationName" TEXT NOT NULL,
ADD COLUMN     "locationState" TEXT NOT NULL,
ADD COLUMN     "tournamentDuosmiumId" TEXT NOT NULL,
ADD COLUMN     "trackName" TEXT;

-- AlterTable
ALTER TABLE "public"."Tournament" DROP COLUMN "locationId",
DROP COLUMN "resultId",
ADD COLUMN     "locationCity" TEXT NOT NULL,
ADD COLUMN     "locationCountry" TEXT NOT NULL DEFAULT 'United States',
ADD COLUMN     "locationName" TEXT NOT NULL,
ADD COLUMN     "locationState" TEXT NOT NULL,
ADD COLUMN     "resultDuosmiumId" TEXT;

-- AlterTable
ALTER TABLE "public"."TournamentEvent" DROP COLUMN "eventId",
DROP COLUMN "tournamentId",
ADD COLUMN     "eventName" TEXT NOT NULL,
ADD COLUMN     "tournamentDuosmiumId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Track" DROP COLUMN "tournamentId",
ADD COLUMN     "tournamentDuosmiumId" TEXT;

-- CreateIndex
CREATE INDEX "Event_name_idx" ON "public"."Event"("name" ASC);

-- CreateIndex
CREATE INDEX "HistoData_tournamentDuosmiumId_eventName_idx" ON "public"."HistoData"("tournamentDuosmiumId" ASC, "eventName" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "HistoData_tournamentDuosmiumId_eventName_key" ON "public"."HistoData"("tournamentDuosmiumId", "eventName");

-- CreateIndex
CREATE UNIQUE INDEX "Histogram_tournamentDuosmiumId_key" ON "public"."Histogram"("tournamentDuosmiumId");

-- CreateIndex
CREATE INDEX "Histogram_tournamentDuosmiumId_idx" ON "public"."Histogram"("tournamentDuosmiumId" ASC);

-- CreateIndex
CREATE INDEX "Location_name_city_state_country_idx" ON "public"."Location"("name" ASC, "city" ASC, "state" ASC, "country" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Location_name_city_state_country_key" ON "public"."Location"("name", "city", "state", "country");

-- CreateIndex
CREATE INDEX "Penalty_tournamentDuosmiumId_teamNumber_idx" ON "public"."Penalty"("tournamentDuosmiumId" ASC, "teamNumber" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Penalty_tournamentDuosmiumId_teamNumber_key" ON "public"."Penalty"("tournamentDuosmiumId", "teamNumber");

-- CreateIndex
CREATE INDEX "Placing_tournamentDuosmiumId_eventName_teamNumber_idx" ON "public"."Placing"("tournamentDuosmiumId" ASC, "eventName" ASC, "teamNumber" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Placing_tournamentDuosmiumId_eventName_teamNumber_key" ON "public"."Placing"("tournamentDuosmiumId", "eventName", "teamNumber");

-- CreateIndex
CREATE INDEX "Raw_tournamentDuosmiumId_eventName_teamNumber_idx" ON "public"."Raw"("tournamentDuosmiumId" ASC, "eventName" ASC, "teamNumber" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Raw_tournamentDuosmiumId_eventName_teamNumber_key" ON "public"."Raw"("tournamentDuosmiumId", "eventName", "teamNumber");

-- CreateIndex
CREATE INDEX "Result_duosmiumId_idx" ON "public"."Result"("duosmiumId" ASC);

-- CreateIndex
CREATE INDEX "Team_tournamentDuosmiumId_number_idx" ON "public"."Team"("tournamentDuosmiumId" ASC, "number" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Team_tournamentDuosmiumId_number_key" ON "public"."Team"("tournamentDuosmiumId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_resultDuosmiumId_key" ON "public"."Tournament"("resultDuosmiumId");

-- CreateIndex
CREATE INDEX "Tournament_resultDuosmiumId_idx" ON "public"."Tournament"("resultDuosmiumId" ASC);

-- CreateIndex
CREATE INDEX "TournamentEvent_tournamentDuosmiumId_eventName_idx" ON "public"."TournamentEvent"("tournamentDuosmiumId" ASC, "eventName" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "TournamentEvent_tournamentDuosmiumId_eventName_key" ON "public"."TournamentEvent"("tournamentDuosmiumId", "eventName");

-- CreateIndex
CREATE INDEX "Track_tournamentDuosmiumId_name_idx" ON "public"."Track"("tournamentDuosmiumId" ASC, "name" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Track_tournamentDuosmiumId_name_key" ON "public"."Track"("tournamentDuosmiumId", "name");

-- AddForeignKey
ALTER TABLE "public"."Tournament" ADD CONSTRAINT "Tournament_locationName_locationCity_locationState_locatio_fkey" FOREIGN KEY ("locationName", "locationCity", "locationState", "locationCountry") REFERENCES "public"."Location"("name", "city", "state", "country") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tournament" ADD CONSTRAINT "Tournament_resultDuosmiumId_fkey" FOREIGN KEY ("resultDuosmiumId") REFERENCES "public"."Result"("duosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_locationName_locationCity_locationState_locationCount_fkey" FOREIGN KEY ("locationName", "locationCity", "locationState", "locationCountry") REFERENCES "public"."Location"("name", "city", "state", "country") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_tournamentDuosmiumId_fkey" FOREIGN KEY ("tournamentDuosmiumId") REFERENCES "public"."Tournament"("resultDuosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_tournamentDuosmiumId_trackName_fkey" FOREIGN KEY ("tournamentDuosmiumId", "trackName") REFERENCES "public"."Track"("tournamentDuosmiumId", "name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TournamentEvent" ADD CONSTRAINT "TournamentEvent_tournamentDuosmiumId_fkey" FOREIGN KEY ("tournamentDuosmiumId") REFERENCES "public"."Tournament"("resultDuosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TournamentEvent" ADD CONSTRAINT "TournamentEvent_eventName_fkey" FOREIGN KEY ("eventName") REFERENCES "public"."Event"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Track" ADD CONSTRAINT "Track_tournamentDuosmiumId_fkey" FOREIGN KEY ("tournamentDuosmiumId") REFERENCES "public"."Tournament"("resultDuosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Placing" ADD CONSTRAINT "Placing_tournamentDuosmiumId_fkey" FOREIGN KEY ("tournamentDuosmiumId") REFERENCES "public"."Tournament"("resultDuosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Placing" ADD CONSTRAINT "Placing_tournamentDuosmiumId_eventName_fkey" FOREIGN KEY ("tournamentDuosmiumId", "eventName") REFERENCES "public"."TournamentEvent"("tournamentDuosmiumId", "eventName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Placing" ADD CONSTRAINT "Placing_tournamentDuosmiumId_teamNumber_fkey" FOREIGN KEY ("tournamentDuosmiumId", "teamNumber") REFERENCES "public"."Team"("tournamentDuosmiumId", "number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Placing" ADD CONSTRAINT "Placing_tournamentDuosmiumId_trackName_fkey" FOREIGN KEY ("tournamentDuosmiumId", "trackName") REFERENCES "public"."Track"("tournamentDuosmiumId", "name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Penalty" ADD CONSTRAINT "Penalty_tournamentDuosmiumId_fkey" FOREIGN KEY ("tournamentDuosmiumId") REFERENCES "public"."Tournament"("resultDuosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Penalty" ADD CONSTRAINT "Penalty_tournamentDuosmiumId_teamNumber_fkey" FOREIGN KEY ("tournamentDuosmiumId", "teamNumber") REFERENCES "public"."Team"("tournamentDuosmiumId", "number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Penalty" ADD CONSTRAINT "Penalty_tournamentDuosmiumId_trackName_fkey" FOREIGN KEY ("tournamentDuosmiumId", "trackName") REFERENCES "public"."Track"("tournamentDuosmiumId", "name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Raw" ADD CONSTRAINT "Raw_tournamentDuosmiumId_eventName_fkey" FOREIGN KEY ("tournamentDuosmiumId", "eventName") REFERENCES "public"."TournamentEvent"("tournamentDuosmiumId", "eventName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Raw" ADD CONSTRAINT "Raw_tournamentDuosmiumId_eventName_teamNumber_fkey" FOREIGN KEY ("tournamentDuosmiumId", "eventName", "teamNumber") REFERENCES "public"."Placing"("tournamentDuosmiumId", "eventName", "teamNumber") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Raw" ADD CONSTRAINT "Raw_tournamentDuosmiumId_teamNumber_fkey" FOREIGN KEY ("tournamentDuosmiumId", "teamNumber") REFERENCES "public"."Team"("tournamentDuosmiumId", "number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HistoData" ADD CONSTRAINT "HistoData_tournamentDuosmiumId_fkey" FOREIGN KEY ("tournamentDuosmiumId") REFERENCES "public"."Histogram"("tournamentDuosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HistoData" ADD CONSTRAINT "HistoData_tournamentDuosmiumId_eventName_fkey" FOREIGN KEY ("tournamentDuosmiumId", "eventName") REFERENCES "public"."TournamentEvent"("tournamentDuosmiumId", "eventName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Histogram" ADD CONSTRAINT "Histogram_tournamentDuosmiumId_fkey" FOREIGN KEY ("tournamentDuosmiumId") REFERENCES "public"."Tournament"("resultDuosmiumId") ON DELETE CASCADE ON UPDATE CASCADE;
