import type { Metadata } from "next";

import "@/app/globals.css";
import "highlight.js/styles/dark.min.css";

import NavBar from "@/app/ui/NavBar";
import AuthProvider from "./lib/AuthProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export const metadata: Metadata = {
  title: "Thoughtful Threads",
  description: "A place to share your experience and opinions",
};

export default async function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  const session = await getServerSession(authOptions); 

  return (
    <html lang="en">
      <body className={`flex justify-center flex-row`}>
        <AuthProvider session={session!} >
          <NavBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
