"use server";

import prisma from "@/db";

export const contactSupport = async (data: {
  email: string;
  subject: string;
  description: string;
}) => {
  try {
    await prisma.support.create({
      data: data,
    });
    return {
      status: "Success",
      message: "Thanks for reaching out, we'll get back to you asap!",
    };
  } catch (error) {
    console.log(error);
    return {
      status: "Error",
      message: "Something went wrong. Please try again later!",
    };
  }
};
