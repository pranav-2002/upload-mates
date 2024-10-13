import prisma from "@/db";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials: any) {
        const { email, password } = credentials;

        try {
          // Check existing user
          const user = await prisma.user.findUnique({
            where: {
              email: email,
            },
          });
          if (!user) {
            return null;
          }

          // Checking if password is correct
          const validPassword = await compare(password, user.password);
          console.log("auth", validPassword);

          if (!validPassword) {
            return null;
          }

          const { password: _, ...userData } = user;

          return userData as any;
        } catch (error) {
          console.log("Error while logging in", error);
        }
      },
    }),
  ],
  pages: {
    signIn: "auth/login",
  },
  secret: process.env.JWT_SECRET,
  callbacks: {
    authorized: ({ auth, request: { nextUrl } }: any) => {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    async jwt({ token, user }: any) {
      if (user) {
        return { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user = { ...session.user, ...token };
      return session;
    },
  },
};
