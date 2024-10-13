-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "channel_id" INTEGER NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
