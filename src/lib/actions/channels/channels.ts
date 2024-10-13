"use server";

import prisma from "@/db";

export const getChannelNames = async (userId: number) => {
  const channelNames = await prisma.channel.findMany({
    where: {
      user_id: userId,
    },
    select: {
      id: true,
      channel_name: true,
    },
  });
  if (channelNames) {
    return {
      status: "Success",
      data: channelNames,
    };
  }
  return {
    status: "Error",
    data: [],
    message: "Could not fetch channels",
  };
};
