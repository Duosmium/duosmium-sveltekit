/*
  Warnings:

  - You are about to drop the column `placingId` on the `Raw` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Raw_placingId_key";

-- AlterTable
ALTER TABLE "public"."Raw" DROP COLUMN "placingId";
