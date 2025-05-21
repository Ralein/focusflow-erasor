import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";
import Head from "next/head";
import Script from "next/script";
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Focusflow",
  description: "A Student Companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
         <Head>
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
            strategy="lazyOnload"
            crossOrigin="anonymous"
          />
        </Head>
        <body className={inter.className}>
          <ConvexClientProvider>
           {children}
           <Toaster />
          </ConvexClientProvider>
          </body>
      </html>
    </ClerkProvider>
  );
}
