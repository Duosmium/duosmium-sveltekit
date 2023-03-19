-- CreateEnum
CREATE TYPE "Level" AS ENUM ('Invitational', 'Regionals', 'States', 'Nationals');

-- CreateEnum
CREATE TYPE "Division" AS ENUM ('A', 'B', 'C');

-- CreateTable
CREATE TABLE "Tournament" (
    "id" SERIAL NOT NULL,
    "duosmiumId" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,
    "level" "Level" NOT NULL,
    "division" "Division" NOT NULL,
    "year" INTEGER NOT NULL,
    "name" TEXT,
    "shortName" TEXT,
    "medals" INTEGER NOT NULL,
    "trophies" INTEGER NOT NULL,
    "bids" INTEGER NOT NULL DEFAULT 0,
    "bidsPerSchool" INTEGER NOT NULL DEFAULT 1,
    "worstPlacingsDropped" INTEGER NOT NULL DEFAULT 0,
    "exemptPlacings" INTEGER NOT NULL DEFAULT 0,
    "reverseScoring" BOOLEAN NOT NULL DEFAULT false,
    "maximumPlace" INTEGER NOT NULL,
    "perEventN" TEXT NOT NULL,
    "nOffset" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "awardsDate" TIMESTAMP(3),
    "testRelease" TEXT,
    "hasCustomMaximumPlace" BOOLEAN NOT NULL,
    "hasTies" BOOLEAN NOT NULL,
    "hasTiesOutsideOfMaximumPlaces" BOOLEAN NOT NULL,
    "hasTracks" BOOLEAN NOT NULL,
    "largestPlace" INTEGER NOT NULL,
    "nonExhibitionTeamsCount" INTEGER NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "tournamentId" INTEGER,
    "schoolId" INTEGER NOT NULL,
    "trackId" INTEGER,
    "rank" INTEGER NOT NULL,
    "trackRank" INTEGER,
    "points" INTEGER NOT NULL,
    "trackPoints" INTEGER,
    "earnedBid" BOOLEAN NOT NULL DEFAULT false,
    "trialEventPoints" INTEGER NOT NULL,
    "trackTrialEventPoints" INTEGER,
    "medalCounts" INTEGER[],
    "trialEventMedalCounts" INTEGER[],
    "trackMedalCounts" INTEGER[],
    "trackTrialEventMedalCounts" INTEGER[],

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentEvent" (
    "id" SERIAL NOT NULL,
    "tournamentId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "trial" BOOLEAN NOT NULL DEFAULT false,
    "trialed" BOOLEAN NOT NULL DEFAULT false,
    "lowScoreWins" BOOLEAN NOT NULL DEFAULT false,
    "highScoreWins" BOOLEAN NOT NULL DEFAULT true,
    "medals" INTEGER NOT NULL,
    "maximumPlace" INTEGER NOT NULL,

    CONSTRAINT "TournamentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" SERIAL NOT NULL,
    "tournamentId" INTEGER,
    "name" TEXT NOT NULL,
    "medals" INTEGER NOT NULL,
    "trophies" INTEGER NOT NULL,
    "maximumPlace" INTEGER NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Placing" (
    "id" SERIAL NOT NULL,
    "tournamentId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "participated" BOOLEAN NOT NULL DEFAULT true,
    "disqualified" BOOLEAN NOT NULL DEFAULT false,
    "exempt" BOOLEAN NOT NULL DEFAULT false,
    "unknown" BOOLEAN NOT NULL DEFAULT false,
    "explicit" BOOLEAN NOT NULL DEFAULT false,
    "trackPlace" INTEGER,
    "rawId" INTEGER,
    "participationOnly" BOOLEAN NOT NULL DEFAULT false,
    "droppedAsPartOfWorstPlacings" BOOLEAN NOT NULL DEFAULT false,
    "tie" BOOLEAN NOT NULL DEFAULT false,
    "place" INTEGER NOT NULL,
    "initiallyConsideredForTeamPoints" BOOLEAN NOT NULL DEFAULT true,
    "consideredForTeamPoints" BOOLEAN NOT NULL DEFAULT true,
    "isolatedPoints" INTEGER NOT NULL,
    "isolatedTrackPoints" INTEGER,
    "points" INTEGER NOT NULL,
    "trackPoints" INTEGER,
    "pointsAffectedByExhibition" BOOLEAN NOT NULL DEFAULT false,
    "pointsLimitedByMaximumPlace" BOOLEAN NOT NULL DEFAULT false,
    "trackExhibitionPlacingsBehind" INTEGER,
    "exhibitionPlacingsBehind" INTEGER NOT NULL DEFAULT 0,
    "trackId" INTEGER,

    CONSTRAINT "Placing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Penalty" (
    "id" SERIAL NOT NULL,
    "tournamentId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "trackId" INTEGER,

    CONSTRAINT "Penalty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Raw" (
    "id" SERIAL NOT NULL,
    "tournamentId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "lowScoreWins" BOOLEAN NOT NULL DEFAULT false,
    "score" DOUBLE PRECISION NOT NULL,
    "tier" INTEGER NOT NULL DEFAULT 1,
    "tiered" BOOLEAN NOT NULL DEFAULT false,
    "tiebreakerRank" INTEGER NOT NULL DEFAULT 1,
    "lostTieBreaker" BOOLEAN NOT NULL DEFAULT false,
    "placingId" INTEGER NOT NULL,

    CONSTRAINT "Raw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" SERIAL NOT NULL,
    "locationId" INTEGER NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoData" (
    "id" SERIAL NOT NULL,
    "parentId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "start" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "counts" DOUBLE PRECISION[],

    CONSTRAINT "HistoData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Histogram" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT,
    "tournamentId" INTEGER NOT NULL,

    CONSTRAINT "Histogram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "schoolId" INTEGER,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_duosmiumId_key" ON "Tournament"("duosmiumId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_tournamentId_number_key" ON "Team"("tournamentId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Event_name_key" ON "Event"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Track_tournamentId_name_key" ON "Track"("tournamentId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Placing_tournamentId_eventId_teamId_key" ON "Placing"("tournamentId", "eventId", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Penalty_tournamentId_teamId_key" ON "Penalty"("tournamentId", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Raw_placingId_key" ON "Raw"("placingId");

-- CreateIndex
CREATE UNIQUE INDEX "School_locationId_key" ON "School"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "HistoData_eventId_key" ON "HistoData"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Location_name_city_state_key" ON "Location"("name", "city", "state");

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentEvent" ADD CONSTRAINT "TournamentEvent_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentEvent" ADD CONSTRAINT "TournamentEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placing" ADD CONSTRAINT "Placing_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placing" ADD CONSTRAINT "Placing_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "TournamentEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placing" ADD CONSTRAINT "Placing_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placing" ADD CONSTRAINT "Placing_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penalty" ADD CONSTRAINT "Penalty_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penalty" ADD CONSTRAINT "Penalty_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penalty" ADD CONSTRAINT "Penalty_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Raw" ADD CONSTRAINT "Raw_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Raw" ADD CONSTRAINT "Raw_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "TournamentEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Raw" ADD CONSTRAINT "Raw_placingId_fkey" FOREIGN KEY ("placingId") REFERENCES "Placing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoData" ADD CONSTRAINT "HistoData_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Histogram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoData" ADD CONSTRAINT "HistoData_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "TournamentEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Histogram" ADD CONSTRAINT "Histogram_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
