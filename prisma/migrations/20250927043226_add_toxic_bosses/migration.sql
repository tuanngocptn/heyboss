-- CreateTable
CREATE TABLE "public"."toxic_bosses" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bossName" TEXT NOT NULL,
    "bossCompany" TEXT,
    "bossPosition" TEXT,
    "bossDepartment" TEXT,
    "bornYear" INTEGER,
    "workLocation" TEXT,
    "reporterEmail" TEXT,
    "reportContent" TEXT NOT NULL,
    "categories" TEXT[],
    "markdownPath" TEXT,
    "pdfPath" TEXT,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "submissionDate" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "toxic_bosses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "toxic_bosses_bossName_idx" ON "public"."toxic_bosses"("bossName");

-- CreateIndex
CREATE INDEX "toxic_bosses_bossCompany_idx" ON "public"."toxic_bosses"("bossCompany");

-- CreateIndex
CREATE INDEX "toxic_bosses_workLocation_idx" ON "public"."toxic_bosses"("workLocation");

-- CreateIndex
CREATE INDEX "toxic_bosses_submissionDate_idx" ON "public"."toxic_bosses"("submissionDate");
