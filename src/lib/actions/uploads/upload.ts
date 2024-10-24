"use server";

import prisma from "@/db";
import { authOptions } from "@/lib/auth";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

type metaDataType = {
  fileType: string;
  thumbnailType: string;
  videoTile: string;
  videoDescription: string;
  channelId: number;
};

export const uploadVideo = async (
  videoData: FormData,
  thumbnailData: FormData,
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

  if (thumbnailData.get("file") === "") {
    return {
      status: "Error",
      message: "Please upload a thumbnail image",
    };
  }

  // Object Keys
  const videoFormat = metadata.fileType.split("/")[1];
  const thumbnailFormat = metadata.thumbnailType.split("/")[1];
  const videoObjectKey = `${nanoid()}.${videoFormat}`;
  const thumbnailObjectKey = `${nanoid()}.${thumbnailFormat}`;

  // Creating the client
  const client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION || "",
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "",
    },
  });

  // Video Presigned Post
  const videoPresignedPost = await createPresignedPost(client, {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || "",
    Key: videoObjectKey,
  });

  // Thumbnail Presigned Post
  const thumbnailPresignedPost = await createPresignedPost(client, {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || "",
    Key: thumbnailObjectKey,
  });

  // AWS Request Body for video
  const formData = new FormData();
  Object.entries(videoPresignedPost.fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  // Adding video file
  formData.append("file", videoData.get("file") || "");

  // AWS Request Body for thumbnail
  const imageData = new FormData();
  Object.entries(thumbnailPresignedPost.fields).forEach(([key, value]) => {
    imageData.append(key, value);
  });
  // Adding image file
  imageData.append("file", thumbnailData.get("file") || "");

  try {
    // AWS S3 Upload
    const videoUploadResponse = await fetch(videoPresignedPost.url, {
      method: "POST",
      body: formData,
    });

    const imageUploadResponse = await fetch(thumbnailPresignedPost.url, {
      method: "POST",
      body: imageData,
    });

    if (videoUploadResponse.ok && imageUploadResponse.ok) {
      const videoUrl = `${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/${videoObjectKey}`;
      const thumbnailUrl = `${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/${thumbnailObjectKey}`;

      // Saving to the DB
      const upload = await prisma.upload.create({
        data: {
          user_id: session.user.id,
          video_title: metadata.videoTile,
          video_description: metadata.videoDescription,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          channel_id: metadata.channelId,
        },
      });

      return {
        status: "Success",
        message: "Video saved successfully",
        data: upload,
      };
    } else {
      const errorTextVideo = await videoUploadResponse.text();
      const errorTextThumbnail = await imageUploadResponse.text();
      console.log("Video Error", errorTextVideo);
      console.log("Image Error", errorTextThumbnail);
      return {
        status: "Error",
        message: "Failed to save video (AWS Error)",
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

export const getVideoDetails = async (videoId: number) => {
  const session = await getServerSession(authOptions);

  if (!session.user) {
    return redirect(`${process.env.NEXTAUTH_URL}/auth/login`);
  }

  try {
    const videoDetails = await prisma.upload.findUnique({
      where: {
        id: videoId,
      },
      include: {
        channel: {
          select: {
            channel_name: true,
          },
        },
        User: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    if (!videoDetails) {
      return notFound();
    }

    return {
      status: "Success",
      message: "Video saved successfully",
      data: videoDetails,
    };
  } catch (error) {
    console.log(error);
    return {
      status: "Error",
      message: "Internal Server Error",
      data: [],
    };
  }
};

type statusType = "REJECTED" | "PENDING" | "APPROVED";
export const modifyUploadRequest = async (
  videoId: number,
  status: statusType
) => {
  try {
    const modification = await prisma.upload.update({
      where: {
        id: videoId,
      },
      data: {
        status: status,
      },
    });

    if (!modification) {
      return {
        status: "Error",
        message: "Something went wrong!",
      };
    }

    return {
      status: "Success",
      message: `Video ${status.toLocaleLowerCase()} successfully! Please ask the uploader to upload the video on YouTube`,
    };
  } catch (error) {
    console.log(error);
    return {
      status: "Error",
      message: "Internal Server Error",
    };
  }
};
