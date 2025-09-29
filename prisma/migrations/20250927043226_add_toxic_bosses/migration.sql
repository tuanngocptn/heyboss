-- CreateTable
CREATE TABLE "public"."toxic_bosses" (
    id TEXT NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL,
    boss_name TEXT NOT NULL,
    boss_company TEXT,
    boss_position TEXT,
    boss_department TEXT,
    born_year INTEGER,
    work_location TEXT,
    reporter_email TEXT,
    categories TEXT[],
    markdown_path TEXT,
    pdf_path TEXT,
    locked BOOLEAN NOT NULL DEFAULT false,
    submission_date TIMESTAMP(3) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT false,
    published BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "toxic_bosses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "toxic_bosses_boss_name_idx" ON "public"."toxic_bosses"("boss_name");

-- CreateIndex
CREATE INDEX "toxic_bosses_boss_company_idx" ON "public"."toxic_bosses"("boss_company");

-- CreateIndex
CREATE INDEX "toxic_bosses_work_location_idx" ON "public"."toxic_bosses"("work_location");

-- CreateIndex
CREATE INDEX "toxic_bosses_submission_date_idx" ON "public"."toxic_bosses"("submission_date");
