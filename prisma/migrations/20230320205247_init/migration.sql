/*
  Warnings:

  - Added the required column `teamId` to the `Raw` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HistoData" ADD COLUMN     "info" JSONB;

-- AlterTable
ALTER TABLE "Raw" ADD COLUMN     "teamId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Raw" ADD CONSTRAINT "Raw_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
