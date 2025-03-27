import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "App",
  icons: {
    icon: '/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body
      className={ `${ geistSans.variable } ${ geistMono.variable } antialiased` }
    >
    <div className='h-screen w-screen bg-gray-200 flex items-center justify-center'>
      { children }
    </div>
    <Toaster />
    </body>
    </html>
  );
}
