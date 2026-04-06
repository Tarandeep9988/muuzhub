-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "thumbnailUrlHQ" TEXT,
ADD COLUMN     "thumbnailUrlLQ" TEXT,
ADD COLUMN     "title" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "url" SET DEFAULT '';
