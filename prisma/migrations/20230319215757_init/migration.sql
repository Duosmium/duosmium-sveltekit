-- DropForeignKey
ALTER TABLE "HistoData" DROP CONSTRAINT "HistoData_eventId_fkey";

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
ALTER TABLE "Tournament" DROP CONSTRAINT "Tournament_resultId_fkey";

-- DropForeignKey
ALTER TABLE "TournamentEvent" DROP CONSTRAINT "TournamentEvent_eventId_fkey";

-- DropForeignKey
ALTER TABLE "TournamentEvent" DROP CONSTRAINT "TournamentEvent_tournamentId_fkey";

-- AlterTable
ALTER TABLE "HistoData" ALTER COLUMN "eventId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Penalty" ALTER COLUMN "tournamentId" DROP NOT NULL,
ALTER COLUMN "teamId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Placing" ALTER COLUMN "tournamentId" DROP NOT NULL,
ALTER COLUMN "eventId" DROP NOT NULL,
ALTER COLUMN "teamId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Raw" ALTER COLUMN "tournamentId" DROP NOT NULL,
ALTER COLUMN "eventId" DROP NOT NULL,
ALTER COLUMN "placingId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tournament" ALTER COLUMN "resultId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TournamentEvent" ALTER COLUMN "tournamentId" DROP NOT NULL,
ALTER COLUMN "eventId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentEvent" ADD CONSTRAINT "TournamentEvent_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentEvent" ADD CONSTRAINT "TournamentEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placing" ADD CONSTRAINT "Placing_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placing" ADD CONSTRAINT "Placing_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "TournamentEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placing" ADD CONSTRAINT "Placing_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penalty" ADD CONSTRAINT "Penalty_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penalty" ADD CONSTRAINT "Penalty_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Raw" ADD CONSTRAINT "Raw_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Raw" ADD CONSTRAINT "Raw_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "TournamentEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Raw" ADD CONSTRAINT "Raw_placingId_fkey" FOREIGN KEY ("placingId") REFERENCES "Placing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoData" ADD CONSTRAINT "HistoData_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "TournamentEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
