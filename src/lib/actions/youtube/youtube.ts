"use server";

import axios from "axios";
import { nanoid } from "nanoid";
import path from "path";
import fs from "fs";
import { google } from "googleapis";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { OAuth2Client } from "google-auth-library";
import { redirect } from "next/navigation";

// Download Video
async function downloadVideo(url: string): Promise<string> {
  const videoId = nanoid();
  const tempDir = process.env.VERCEL ? "/tmp" : "src/lib/actions/youtube/temp";
  const filePath = path.join(tempDir, `${videoId}.mp4`);

  const writer = fs.createWriteStream(filePath);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return filePath;
}

async function uploadVideoToYouTube(
  authClient: OAuth2Client,
  filePath: string,
  title: string,
  description: string
) {
  const youtube = google.youtube({
    version: "v3",
    auth: authClient,
  });

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
      body: fs.createReadStream(filePath),
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
  // let tempFilePath = "";
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
      return {
        status: "Error",
        message: "Unauthorized Error",
      };
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

    // Download the video
    const filePath = await downloadVideo(body.videoUrl);
    // tempFilePath = filePath;

    // Upload to YouTube using the OAuth client
    const uploadResponse = await uploadVideoToYouTube(
      oauth2Client,
      filePath,
      body.videoTitle,
      body.videoDescription
    );

    // Clean up the temporary file after upload
    // fs.unlinkSync(filePath);

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
    // fs.unlinkSync(tempFilePath);
    return {
      status: "Error",
      message: "Internal Server Error",
    };
  }
}
