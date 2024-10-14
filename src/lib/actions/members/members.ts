"use server";

import prisma from "@/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type addNewMemberType = {
  memberEmail: string;
  selectedChannel: number;
};
export const addNewMember = async (data: addNewMemberType) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect(`${process.env.NEXTAUTH_URL}/auth/login`);
  }

  try {
    const { memberEmail, selectedChannel } = data;

    // Check if existing member exists
    const user = await prisma.user.findUnique({
      where: {
        email: memberEmail,
      },
      select: {
        id: true,
        first_name: true,
        email: true,
      },
    });

    if (!user) {
      return {
        status: "Error",
        message: "Ask this member to sign up first",
      };
    }

    // Add new member
    const newMember = await prisma.member.create({
      data: {
        user_id: user.id,
        parent_id: session.user.id,
        channel_id: selectedChannel,
        member_name: user.first_name,
        member_email: user.email,
      },
    });
    return {
      status: "Success",
      message: "Member added successfully",
      data: newMember,
    };
  } catch (error) {
    console.log(error);
    return {
      status: "Error",
      message: "Something went wrong, please try again later!",
    };
  }
};

export const getAllMembers = async () => {
  const session = await getServerSession(authOptions);

  if (!session.user) {
    return redirect(`${process.env.NEXTAUTH_URL}/auth/login`);
  }

  try {
    const members = await prisma.member.findMany({
      where: {
        parent_id: session.user.id,
      },
    });

    return {
      status: "Success",
      message: "Member added successfully",
      data: members,
    };
  } catch (error) {
    console.log(error);
    return {
      status: "Error",
      message: "Something went wrong, please try again later!",
    };
  }
};

export const getAllMemberChannels = async () => {
  const session = await getServerSession(authOptions);

  if (!session.user) {
    return redirect(`${process.env.NEXTAUTH_URL}/auth/login`);
  }

  try {
    const channels = await prisma.member.findMany({
      where: {
        user_id: session.user.id,
      },
      include: {
        channel: true,
      },
    });
    return {
      status: "Success",
      message: "Channels fetched added successfully",
      channels: channels,
    };
  } catch (error) {
    console.log(error);
    return {
      status: "Error",
      message: "Something went wrong, please try again later!",
    };
  }
};
