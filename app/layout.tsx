import type { Metadata } from "next";

import "@/app/globals.css";

import NavBar from "@/app/ui/NavBar";
import AuthProvider from "./lib/AuthProvider";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "Thoughtfull Threads",
  description: "A place to share your experience and opinions",
};

export default async function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={`max-w-7xl mx-auto flex flex-row`}>
        <AuthProvider session={session!} >
          <NavBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
