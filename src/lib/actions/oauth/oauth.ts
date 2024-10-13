"use server";

import { authOptions } from "@/lib/auth";
import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const generateAuthLink = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/oauth/callback`
  );

  const authURL = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtube.readonly",
    ],
  });

  if (authURL) {
    redirect(authURL);
  }
};
