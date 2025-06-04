/*
  Warnings:

  - You are about to drop the column `fullResolution` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `files` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "files" DROP COLUMN "fullResolution",
DROP COLUMN "thumbnail",
ADD COLUMN     "fullResolutionKey" TEXT,
ADD COLUMN     "thumbnailKey" TEXT,
ADD COLUMN     "thumbnailUrl" TEXT;
