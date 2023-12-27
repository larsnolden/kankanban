import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Providers from "./Providers";

import PrelineScript from "@/Components/PrelineScript";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NEST",
  description: "Break down your tasks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full relative max-h-screen overflow-hidden">
      <body className={`${inter.className} h-full relative`}>
        <Providers>{children}</Providers>
      </body>
      <PrelineScript />
    </html>
  );
}
