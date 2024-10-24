-- CreateEnum
CREATE TYPE "Ststus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Upload" ADD COLUMN     "status" "Ststus" NOT NULL DEFAULT 'PENDING';
