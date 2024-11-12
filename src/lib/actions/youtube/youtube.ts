"use server";

import axios from "axios";
import { google } from "googleapis";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { OAuth2Client } from "google-auth-library";
import { notFound, redirect } from "next/navigation";

// Youtube Video Upload
async function uploadVideoToYouTube(
  authClient: OAuth2Client,
  videoUrl: string,
  title: string,
  description: string
) {
  // Authentication
  const youtube = google.youtube({
    version: "v3",
    auth: authClient,
  });

  // Downloading Video
  const response = await axios({
    url: videoUrl,
    method: "GET",
    responseType: "stream",
    timeout: 30000,
  });

  // Video Insert Request
  const res = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title,
        description,
        defaultLanguage: "en",
        defaultAudioLanguage: "en",
      },
      status: {
        privacyStatus: "private",
      },
    },
    media: {
      body: response.data,
    },
  });

  return res.data;
}

// Video Upload
export async function handleVideoUpload(body: {
  videoUrl: string;
  videoTitle: string;
  videoDescription: string;
  videoId: number;
  channelId: number;
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session.user) {
      redirect(`${process.env.NEXTAUTH_URL}/auth/login`);
    }

    const channel = await prisma.channel.findUnique({
      where: {
        id: body.channelId,
      },
    });

    if (!channel) {
      notFound();
    }

    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({
      access_token: channel.access_token,
      refresh_token: channel.refresh_token,
    });

    // Refreshing the token
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);

    // Upload to YouTube using the OAuth client
    const uploadResponse = await uploadVideoToYouTube(
      oauth2Client,
      body.videoUrl,
      body.videoTitle,
      body.videoDescription
    );

    if (uploadResponse) {
      await prisma.youtube_Upload.create({
        data: {
          upload_id: body.videoId,
        },
      });
    }

    return {
      status: "Success",
      message: "Video Uploaded Successfully",
      data: uploadResponse,
    };
  } catch (error) {
    console.error("Error uploading video:", error);
    return {
      status: "Error",
      message: "Internal Server Error",
    };
  }
}
