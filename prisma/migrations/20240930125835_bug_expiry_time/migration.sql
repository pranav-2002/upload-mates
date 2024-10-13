/*
  Warnings:

  - Changed the type of `expires_at` on the `Credentials` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Credentials" DROP COLUMN "expires_at",
ADD COLUMN     "expires_at" INTEGER NOT NULL;
