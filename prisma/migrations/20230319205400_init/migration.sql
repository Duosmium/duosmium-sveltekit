/*
  Warnings:

  - You are about to drop the column `duosmiumId` on the `Tournament` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[resultId]` on the table `Tournament` will be added. If there are existing duplicate values, this will fail.
  - Made the column `tournamentId` on table `Team` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `resultId` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_tournamentId_fkey";

-- DropIndex
DROP INDEX "Tournament_duosmiumId_key";

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "tournamentId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "duosmiumId",
ADD COLUMN     "resultId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Result" (
    "id" SERIAL NOT NULL,
    "duosmiumId" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Result_duosmiumId_key" ON "Result"("duosmiumId");

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_resultId_key" ON "Tournament"("resultId");

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
