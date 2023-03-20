-- AlterTable
ALTER TABLE "Tournament" ALTER COLUMN "startDate" SET DATA TYPE DATE,
ALTER COLUMN "endDate" SET DATA TYPE DATE,
ALTER COLUMN "awardsDate" SET DATA TYPE DATE;

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT,
    "policy" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPolicy" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "policy" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "UserPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrganizationToUserPolicy" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_organizationId_key" ON "Organization"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPolicy_user_id_key" ON "UserPolicy"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "_OrganizationToUserPolicy_AB_unique" ON "_OrganizationToUserPolicy"("A", "B");

-- CreateIndex
CREATE INDEX "_OrganizationToUserPolicy_B_index" ON "_OrganizationToUserPolicy"("B");

-- AddForeignKey
ALTER TABLE "_OrganizationToUserPolicy" ADD CONSTRAINT "_OrganizationToUserPolicy_A_fkey" FOREIGN KEY ("A") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToUserPolicy" ADD CONSTRAINT "_OrganizationToUserPolicy_B_fkey" FOREIGN KEY ("B") REFERENCES "UserPolicy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
