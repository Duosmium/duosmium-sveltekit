-- AlterTable
ALTER TABLE "results" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(6);