"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./themes/theme-provider";

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
      </ThemeProvider>
    </SessionProvider>
  );
}
