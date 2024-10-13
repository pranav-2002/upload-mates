/*
  Warnings:

  - Added the required column `parent_id` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "parent_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
