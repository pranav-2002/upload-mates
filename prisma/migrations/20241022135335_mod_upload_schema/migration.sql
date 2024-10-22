/*
  Warnings:

  - You are about to drop the column `video_link` on the `Upload` table. All the data in the column will be lost.
  - Added the required column `thumbnail_url` to the `Upload` table without a default value. This is not possible if the table is not empty.
  - Added the required column `video_url` to the `Upload` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Upload" DROP COLUMN "video_link",
ADD COLUMN     "thumbnail_url" TEXT NOT NULL,
ADD COLUMN     "video_url" TEXT NOT NULL;
