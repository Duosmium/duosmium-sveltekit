/*
  Warnings:

  - The primary key for the `Result` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `duosmiumId` on the `Result` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "HistoData" DROP CONSTRAINT "HistoData_eventId_fkey";

-- DropForeignKey
ALTER TABLE "HistoData" DROP CONSTRAINT "HistoData_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Histogram" DROP CONSTRAINT "Histogram_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "Penalty" DROP CONSTRAINT "Penalty_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Penalty" DROP CONSTRAINT "Penalty_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "Placing" DROP CONSTRAINT "Placing_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Placing" DROP CONSTRAINT "Placing_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Placing" DROP CONSTRAINT "Placing_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "Raw" DROP CONSTRAINT "Raw_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Raw" DROP CONSTRAINT "Raw_placingId_fkey";

-- DropForeignKey
ALTER TABLE "Raw" DROP CONSTRAINT "Raw_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "Tournament" DROP CONSTRAINT "Tournament_resultId_fkey";

-- DropForeignKey
ALTER TABLE "TournamentEvent" DROP CONSTRAINT "TournamentEvent_eventId_fkey";

-- DropForeignKey
ALTER TABLE "TournamentEvent" DROP CONSTRAINT "TournamentEvent_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_tournamentId_fkey";

-- DropIndex
DROP INDEX "Result_duosmiumId_key";

-- AlterTable
ALTER TABLE "Result" DROP CONSTRAINT "Result_pkey",
DROP COLUMN "duosmiumId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "logo" DROP NOT NULL,
ALTER COLUMN "color" DROP NOT NULL,
ADD CONSTRAINT "Result_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Result_id_seq";

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "tournamentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tournament" ALTER COLUMN "resultId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentEvent" ADD CONSTRAINT "TournamentEvent_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentEvent" ADD CONSTRAINT "TournamentEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placing" ADD CONSTRAINT "Placing_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placing" ADD CONSTRAINT "Placing_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "TournamentEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placing" ADD CONSTRAINT "Placing_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penalty" ADD CONSTRAINT "Penalty_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penalty" ADD CONSTRAINT "Penalty_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Raw" ADD CONSTRAINT "Raw_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Raw" ADD CONSTRAINT "Raw_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "TournamentEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Raw" ADD CONSTRAINT "Raw_placingId_fkey" FOREIGN KEY ("placingId") REFERENCES "Placing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoData" ADD CONSTRAINT "HistoData_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Histogram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoData" ADD CONSTRAINT "HistoData_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "TournamentEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Histogram" ADD CONSTRAINT "Histogram_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;
