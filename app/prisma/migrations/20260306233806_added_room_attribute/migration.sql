/*
  Warnings:

  - The values [Spotify] on the enum `StreamType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `bigImageUrl` on the `Stream` table. All the data in the column will be lost.
  - You are about to drop the column `extractedId` on the `Stream` table. All the data in the column will be lost.
  - You are about to drop the column `smallImageUrl` on the `Stream` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Stream` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Stream` table. All the data in the column will be lost.
  - You are about to drop the `Upvotes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `roomId` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Upvotes" DROP CONSTRAINT "Upvotes_streamId_fkey";

-- DropForeignKey
ALTER TABLE "Upvotes" DROP CONSTRAINT "Upvotes_userId_fkey";

-- AlterTable
ALTER TABLE "Stream" DROP COLUMN "bigImageUrl",
DROP COLUMN "extractedId",
DROP COLUMN "smallImageUrl",
DROP COLUMN "title",
DROP COLUMN "type",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "played" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "roomId" TEXT NOT NULL;

-- AlterEnum
BEGIN;
CREATE TYPE "StreamType_new" AS ENUM ('Youtube');
ALTER TYPE "StreamType" RENAME TO "StreamType_old";
ALTER TYPE "StreamType_new" RENAME TO "StreamType";
DROP TYPE "public"."StreamType_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Upvotes";

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "currentStreamId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Upvote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Upvote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_currentStreamId_key" ON "Room"("currentStreamId");

-- CreateIndex
CREATE UNIQUE INDEX "Upvote_userId_streamId_key" ON "Upvote"("userId", "streamId");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_currentStreamId_fkey" FOREIGN KEY ("currentStreamId") REFERENCES "Stream"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stream" ADD CONSTRAINT "Stream_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
