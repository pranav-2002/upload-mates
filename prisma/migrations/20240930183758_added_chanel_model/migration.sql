/*
  Warnings:

  - You are about to drop the `Credentials` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Credentials" DROP CONSTRAINT "Credentials_user_id_fkey";

-- DropTable
DROP TABLE "Credentials";

-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "channel_name" TEXT NOT NULL,
    "channel_image" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
