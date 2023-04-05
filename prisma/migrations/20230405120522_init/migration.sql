-- AlterTable
ALTER TABLE "public"."Track" ALTER COLUMN "medals" DROP NOT NULL,
ALTER COLUMN "trophies" DROP NOT NULL,
ALTER COLUMN "maximumPlace" DROP NOT NULL;
