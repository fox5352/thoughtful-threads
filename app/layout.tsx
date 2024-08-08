import type { Metadata } from "next";

import "@/app/globals.css";

import NavBar from "@/app/ui/NavBar";

export const metadata: Metadata = {
  title: "Thoughtfull Threads",
  description: "A place to share your experience and opinions",
};

export default async function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <body className={`max-w-7xl mx-auto flex flex-row`}>
          <NavBar />
          {children}
      </body>
    </html>
  );
}
