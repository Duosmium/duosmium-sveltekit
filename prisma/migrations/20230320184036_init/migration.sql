/*
  Warnings:

  - You are about to drop the column `tournamentId` on the `Raw` table. All the data in the column will be lost.
  - The primary key for the `Result` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Result` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `resultId` column on the `Tournament` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[tournamentId]` on the table `Histogram` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[duosmiumId]` on the table `Result` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tournamentId,eventId]` on the table `TournamentEvent` will be added. If there are existing duplicate values, this will fail.
  - Made the column `eventId` on table `HistoData` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tournamentId` on table `Penalty` required. This step will fail if there are existing NULL values in that column.
  - Made the column `teamId` on table `Penalty` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tournamentId` on table `Placing` required. This step will fail if there are existing NULL values in that column.
  - Made the column `eventId` on table `Placing` required. This step will fail if there are existing NULL values in that column.
  - Made the column `teamId` on table `Placing` required. This step will fail if there are existing NULL values in that column.
  - Made the column `eventId` on table `Raw` required. This step will fail if there are existing NULL values in that column.
  - Made the column `placingId` on table `Raw` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `duosmiumId` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Made the column `tournamentId` on table `Team` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `histogramId` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Made the column `tournamentId` on table `TournamentEvent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `eventId` on table `TournamentEvent` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Raw" DROP CONSTRAINT "Raw_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "Tournament" DROP CONSTRAINT "Tournament_resultId_fkey";

-- AlterTable
ALTER TABLE "HistoData" ALTER COLUMN "eventId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Penalty" ALTER COLUMN "tournamentId" SET NOT NULL,
ALTER COLUMN "teamId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Placing" ALTER COLUMN "tournamentId" SET NOT NULL,
ALTER COLUMN "eventId" SET NOT NULL,
ALTER COLUMN "teamId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Raw" DROP COLUMN "tournamentId",
ALTER COLUMN "eventId" SET NOT NULL,
ALTER COLUMN "placingId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Result" DROP CONSTRAINT "Result_pkey",
ADD COLUMN     "duosmiumId" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Result_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "tournamentId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "histogramId" INTEGER NOT NULL,
DROP COLUMN "resultId",
ADD COLUMN     "resultId" INTEGER;

-- AlterTable
ALTER TABLE "TournamentEvent" ALTER COLUMN "tournamentId" SET NOT NULL,
ALTER COLUMN "eventId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Histogram_tournamentId_key" ON "Histogram"("tournamentId");

-- CreateIndex
CREATE UNIQUE INDEX "Result_duosmiumId_key" ON "Result"("duosmiumId");

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_resultId_key" ON "Tournament"("resultId");

-- CreateIndex
CREATE UNIQUE INDEX "TournamentEvent_tournamentId_eventId_key" ON "TournamentEvent"("tournamentId", "eventId");

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE SET NULL ON UPDATE CASCADE;
