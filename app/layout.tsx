import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from "@vercel/analytics/react"
import Script from "next/script";


export const metadata: Metadata = {
  title: "24HourGPT",
  description: "SOTA LLMs for only $1 per 24 hours",
};

const scriptUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://web.squarecdn.com/v1/square.js'
    : 'https://sandbox.web.squarecdn.com/v1/square.js';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Load the Square Web Payments SDK in sandbox mode for development */}


          <Script src={scriptUrl} strategy="beforeInteractive" />
        </head>
        <body>
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
