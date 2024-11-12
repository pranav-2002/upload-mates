/*
  Warnings:

  - A unique constraint covering the columns `[member_email]` on the table `Member` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Member_member_email_key" ON "Member"("member_email");
