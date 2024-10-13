"use server";

import prisma from "@/db";
import { hash } from "bcrypt-ts";

interface userData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export async function register(data: userData) {
  // Check if user already exists
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
      phone_number: data.phoneNumber,
    },
  });

  if (user) {
    return {
      status: "Error",
      message: "User with this email or number already exists",
    };
  }

  // Create new user
  const hashedPassword = await hash(data.password, 10);

  const newUser = await prisma.user.create({
    data: {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone_number: data.phoneNumber,
      password: hashedPassword,
    },
  });

  if (newUser) {
    return {
      status: "Success",
      message: "Sign Up Successful",
    };
  }

  // Catch any errors
  return {
    status: "Error",
    message: "Something went wrong!",
  };
}
