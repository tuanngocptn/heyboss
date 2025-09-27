-- CreateTable
CREATE TABLE "public"."wl_comment" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "comment" TEXT,
    "insertedat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT DEFAULT '',
    "link" TEXT,
    "mail" TEXT,
    "nick" TEXT,
    "pid" INTEGER,
    "rid" INTEGER,
    "sticky" DECIMAL(65,30),
    "status" TEXT NOT NULL DEFAULT '',
    "like" INTEGER,
    "ua" TEXT,
    "url" TEXT,
    "createdat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3),

    CONSTRAINT "wl_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."wl_counter" (
    "id" SERIAL NOT NULL,
    "time" INTEGER,
    "reaction0" INTEGER,
    "reaction1" INTEGER,
    "reaction2" INTEGER,
    "reaction3" INTEGER,
    "reaction4" INTEGER,
    "reaction5" INTEGER,
    "reaction6" INTEGER,
    "reaction7" INTEGER,
    "reaction8" INTEGER,
    "url" TEXT NOT NULL DEFAULT '',
    "createdat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3),

    CONSTRAINT "wl_counter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."wl_users" (
    "id" SERIAL NOT NULL,
    "display_name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT '',
    "label" TEXT,
    "url" TEXT,
    "avatar" TEXT,
    "github" TEXT,
    "twitter" TEXT,
    "facebook" TEXT,
    "google" TEXT,
    "weibo" TEXT,
    "qq" TEXT,
    "2fa" TEXT,
    "createdat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3),

    CONSTRAINT "wl_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."toxic_bosses" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bossName" TEXT NOT NULL,
    "bossCompany" TEXT,
    "bossPosition" TEXT,
    "bossDepartment" TEXT,
    "bossAge" INTEGER,
    "workLocation" TEXT,
    "reporterEmail" TEXT,
    "reportContent" TEXT NOT NULL,
    "categories" TEXT[],
    "markdownPath" TEXT,
    "pdfPath" TEXT,
    "zipPath" TEXT,
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

-- AddForeignKey
ALTER TABLE "public"."wl_comment" ADD CONSTRAINT "wl_comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."wl_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wl_comment" ADD CONSTRAINT "wl_comment_pid_fkey" FOREIGN KEY ("pid") REFERENCES "public"."wl_comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wl_comment" ADD CONSTRAINT "wl_comment_rid_fkey" FOREIGN KEY ("rid") REFERENCES "public"."wl_comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
