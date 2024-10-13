-- CreateTable
CREATE TABLE "Upload" (
    "id" SERIAL NOT NULL,
    "video_link" TEXT NOT NULL,
    "video_title" TEXT NOT NULL,
    "video_description" TEXT NOT NULL,
    "channel_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Upload_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Upload" ADD CONSTRAINT "Upload_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upload" ADD CONSTRAINT "Upload_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
