import prisma from "@/db";
import { authOptions } from "@/lib/auth";
import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  const formatEpochDate = (timestamp: EpochTimeStamp) => {
    const date = new Date(timestamp);
    const isoDateTime = date.toISOString();
    return isoDateTime;
  };

  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { message: "Invalid authorization code" },
      { status: 400 }
    );
  }

  const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/oauth/callback`,
  });

  try {
    // Getting the tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // YouTube API to get the user's channel information
    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    const response = await youtube.channels.list({
      part: ["snippet"],
      mine: true,
    });

    if (!response.data || !response.data.items) {
      return NextResponse.json({ message: "No channel found" });
    }

    const channelInfo = response.data.items[0];

    // Saving to db
    if (
      tokens.access_token &&
      tokens.refresh_token &&
      tokens.expiry_date &&
      channelInfo.snippet?.title &&
      channelInfo.snippet.thumbnails?.default?.url
    ) {
      await prisma.channel.create({
        data: {
          user_id: session.user.id,
          channel_name: channelInfo.snippet?.title,
          channel_image: channelInfo.snippet?.thumbnails?.default?.url,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: formatEpochDate(tokens.expiry_date),
        },
      });
    } else {
      return NextResponse.json({ message: "Unable to save to the DB" });
    }

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard`);
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    return NextResponse.json(
      { message: "Failed to exchange code for tokens" },
      { status: 500 }
    );
  }
}
