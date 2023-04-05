/*
  Warnings:

  - You are about to drop the column `sourceData` on the `Histogram` table. All the data in the column will be lost.
  - You are about to drop the column `sourceData` on the `Penalty` table. All the data in the column will be lost.
  - You are about to drop the column `sourceData` on the `Placing` table. All the data in the column will be lost.
  - You are about to drop the column `sourceData` on the `Raw` table. All the data in the column will be lost.
  - You are about to drop the column `sourceData` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `sourceData` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `sourceData` on the `TournamentEvent` table. All the data in the column will be lost.
  - You are about to drop the column `sourceData` on the `Track` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Histogram" DROP COLUMN "sourceData";

-- AlterTable
ALTER TABLE "public"."Penalty" DROP COLUMN "sourceData";

-- AlterTable
ALTER TABLE "public"."Placing" DROP COLUMN "sourceData";

-- AlterTable
ALTER TABLE "public"."Raw" DROP COLUMN "sourceData";

-- AlterTable
ALTER TABLE "public"."Team" DROP COLUMN "sourceData";

-- AlterTable
ALTER TABLE "public"."Tournament" DROP COLUMN "sourceData";

-- AlterTable
ALTER TABLE "public"."TournamentEvent" DROP COLUMN "sourceData";

-- AlterTable
ALTER TABLE "public"."Track" DROP COLUMN "sourceData";
