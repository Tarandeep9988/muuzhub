/*
  Warnings:

  - Made the column `thumbnailUrlHQ` on table `Stream` required. This step will fail if there are existing NULL values in that column.
  - Made the column `thumbnailUrlLQ` on table `Stream` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Stream" ALTER COLUMN "thumbnailUrlHQ" SET NOT NULL,
ALTER COLUMN "thumbnailUrlHQ" SET DEFAULT '',
ALTER COLUMN "thumbnailUrlLQ" SET NOT NULL,
ALTER COLUMN "thumbnailUrlLQ" SET DEFAULT '';
