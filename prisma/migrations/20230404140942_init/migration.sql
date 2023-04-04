/*
  Warnings:

  - You are about to drop the column `eventId` on the `HistoData` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `Placing` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `Raw` table. All the data in the column will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPolicy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OrganizationToUserPolicy` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tournamentEventId]` on the table `HistoData` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tournamentEventId,teamId]` on the table `Placing` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tournamentEventId` to the `HistoData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tournamentEventId` to the `Placing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tournamentEventId` to the `Raw` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."HistoData" DROP CONSTRAINT "HistoData_eventId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Placing" DROP CONSTRAINT "Placing_eventId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Raw" DROP CONSTRAINT "Raw_eventId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_OrganizationToUserPolicy" DROP CONSTRAINT "_OrganizationToUserPolicy_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_OrganizationToUserPolicy" DROP CONSTRAINT "_OrganizationToUserPolicy_B_fkey";

-- DropIndex
DROP INDEX "public"."HistoData_eventId_key";

-- DropIndex
DROP INDEX "public"."Placing_eventId_teamId_key";

-- AlterTable
ALTER TABLE "public"."HistoData" DROP COLUMN "eventId",
ADD COLUMN     "tournamentEventId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Histogram" ADD COLUMN     "sourceData" JSONB;

-- AlterTable
ALTER TABLE "public"."Penalty" ADD COLUMN     "sourceData" JSONB;

-- AlterTable
ALTER TABLE "public"."Placing" DROP COLUMN "eventId",
ADD COLUMN     "sourceData" JSONB,
ADD COLUMN     "tournamentEventId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Raw" DROP COLUMN "eventId",
ADD COLUMN     "sourceData" JSONB,
ADD COLUMN     "tournamentEventId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Result" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Team" ADD COLUMN     "sourceData" JSONB;

-- AlterTable
ALTER TABLE "public"."Tournament" ADD COLUMN     "sourceData" JSONB;

-- AlterTable
ALTER TABLE "public"."TournamentEvent" ADD COLUMN     "sourceData" JSONB;

-- AlterTable
ALTER TABLE "public"."Track" ADD COLUMN     "sourceData" JSONB;

-- DropTable
DROP TABLE "public"."Organization";

-- DropTable
DROP TABLE "public"."UserPolicy";

-- DropTable
DROP TABLE "public"."_OrganizationToUserPolicy";

-- CreateIndex
CREATE UNIQUE INDEX "HistoData_tournamentEventId_key" ON "public"."HistoData"("tournamentEventId");

-- CreateIndex
CREATE UNIQUE INDEX "Placing_tournamentEventId_teamId_key" ON "public"."Placing"("tournamentEventId", "teamId");

-- AddForeignKey
ALTER TABLE "public"."Placing" ADD CONSTRAINT "Placing_tournamentEventId_fkey" FOREIGN KEY ("tournamentEventId") REFERENCES "public"."TournamentEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Raw" ADD CONSTRAINT "Raw_tournamentEventId_fkey" FOREIGN KEY ("tournamentEventId") REFERENCES "public"."TournamentEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HistoData" ADD CONSTRAINT "HistoData_tournamentEventId_fkey" FOREIGN KEY ("tournamentEventId") REFERENCES "public"."TournamentEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
