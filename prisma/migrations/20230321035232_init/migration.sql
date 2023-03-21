-- DropForeignKey
ALTER TABLE "Tournament" DROP CONSTRAINT "Tournament_resultId_fkey";

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE CASCADE ON UPDATE CASCADE;
