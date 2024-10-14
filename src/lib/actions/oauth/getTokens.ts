import prisma from "@/db";

export const getTokens = async (tokenId: number, userId: number) => {
  try {
    const userTokens = await prisma.channel.findUnique({
      where: {
        id: tokenId,
        user_id: userId,
      },
      select: {
        access_token: true,
        refresh_token: true,
      },
    });
    if (!userTokens) {
      return {
        status: "Error",
      };
    }
    return {
      status: "Success",
      data: userTokens,
    };
  } catch (error) {
    console.log("error while fetching tokens", error);
    return {
      status: "Error",
    };
  }
};
