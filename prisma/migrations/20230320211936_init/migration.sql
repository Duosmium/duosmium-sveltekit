/*
  Warnings:

  - Made the column `city` on table `Location` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "city" SET NOT NULL;
