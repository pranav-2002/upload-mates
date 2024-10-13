"use server";

import prisma from "@/db";
import { authOptions } from "@/lib/auth";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type metaDataType = {
  fileType: string;
  videoTile: string;
  videoDescription: string;
  channelId: number;
};

export const uploadVideo = async (
  videoData: FormData,
  metadata: metaDataType
) => {
  const session = await getServerSession(authOptions);

  if (!session.user) {
    return redirect(`${process.env.NEXTAUTH_URL}/auth/login`);
  }

  if (videoData.get("file") === "") {
    return {
      status: "Error",
      message: "Please upload a video",
    };
  }

  // Video Key
  const videoFormat = metadata.fileType.split("/")[1];
  const objectKey = `${nanoid()}.${videoFormat}`;

  // Creating the client
  const client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION || "",
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "",
    },
  });
  const { url, fields } = await createPresignedPost(client, {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || "",
    Key: objectKey,
  });

  // AWS Request Body
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  // Adding video file
  formData.append("file", videoData.get("file") || "");

  try {
    // AWS S3 Upload
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const videoLink = `${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/${objectKey}`;
      const upload = await prisma.upload.create({
        data: {
          user_id: session.user.id,
          video_title: metadata.videoTile,
          video_description: metadata.videoDescription,
          video_link: videoLink,
          channel_id: metadata.channelId,
        },
      });

      return {
        status: "Success",
        message: "Video uploaded successfully",
        data: upload,
      };
    } else {
      const errorText = await response.text();
      console.log(errorText);
      return {
        status: "Error",
        message: "Video Upload Failed",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: "Error",
      message: "Internal Server Error",
    };
  }
};
