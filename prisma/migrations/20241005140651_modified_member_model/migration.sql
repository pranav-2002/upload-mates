/*
  Warnings:

  - Added the required column `member_email` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `member_name` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "member_email" TEXT NOT NULL,
ADD COLUMN     "member_name" TEXT NOT NULL;
