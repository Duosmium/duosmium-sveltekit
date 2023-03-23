/*
  Warnings:

  - A unique constraint covering the columns `[eventId,teamId]` on the table `Placing` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Placing_tournamentId_eventId_teamId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Placing_eventId_teamId_key" ON "Placing"("eventId", "teamId");
