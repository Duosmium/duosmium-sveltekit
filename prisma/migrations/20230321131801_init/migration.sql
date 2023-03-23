/*
  Warnings:

  - You are about to drop the column `schoolId` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `schoolId` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the `School` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `locationId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "School" DROP CONSTRAINT "School_locationId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_schoolId_fkey";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "schoolId";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "schoolId",
ADD COLUMN     "locationId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "School";

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
