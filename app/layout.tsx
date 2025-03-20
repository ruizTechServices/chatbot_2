import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from "@vercel/analytics/react"


export const metadata: Metadata = {
  title: "24HourGPT",
  description: "SOTA LLMs for only $1 per 24 hours",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
    </ClerkProvider>
  );
}
