import prisma from "@/db";

export const getUserData = async (userId: number) => {
  try {
    const userData = await prisma.channel.findMany({
      where: {
        user_id: userId,
      },
    });
    return userData;
  } catch (error) {
    console.log(error);
  }
};
