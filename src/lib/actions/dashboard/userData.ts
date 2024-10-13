import prisma from "@/db";

export const getUserData = async (userId: number) => {
  const userData = await prisma.channel.findMany({
    where: {
      user_id: userId,
    },
  });
  return userData;
};
