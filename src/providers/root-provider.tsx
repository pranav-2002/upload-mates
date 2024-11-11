"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./themes/theme-provider";
import NextTopLoader from "nextjs-toploader";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <NextTopLoader />
      </ThemeProvider>
    </SessionProvider>
  );
}
