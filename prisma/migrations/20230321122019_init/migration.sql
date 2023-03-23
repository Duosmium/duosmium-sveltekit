-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "schoolId" INTEGER;

-- CreateTable
CREATE TABLE "School" (
    "id" SERIAL NOT NULL,
    "locationId" INTEGER NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "School_locationId_key" ON "School"("locationId");

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
