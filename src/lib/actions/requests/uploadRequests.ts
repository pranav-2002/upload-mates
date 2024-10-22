"use server";

import prisma from "@/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

export const getAllUploadRequests = async (channelId: number) => {
  const session = await getServerSession(authOptions);

  if (!session.user) {
    return redirect(`${process.env.NEXTAUTH_URL}/auth/login`);
  }

  try {
    // Check if channel id belongs to user
    const channel = await prisma.channel.findUnique({
      where: {
        id: channelId,
      },
    });

    if (!channel || channel.user_id !== session.user.id) {
      return {
        status: "Error",
        description: "Unauthorized Error",
      };
    }

    const response = await prisma.upload.findMany({
      where: {
        channel_id: channelId,
      },
      select: {
        id: true,
        video_url: true,
        thumbnail_url: true,
        video_title: true,
        video_description: true,
      },
    });

    if (response.length === 0) {
      return {
        status: "Success",
        description: "No Video Requests",
      };
    }

    return {
      status: "Success",
      description: "Video Requests Fetched",
      data: response,
    };
  } catch (error) {
    console.log(error);
    return {
      status: "Error",
      description: "Internal Server Error",
    };
  }
};
