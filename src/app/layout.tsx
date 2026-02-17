import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useThemeStore } from "@/store/themeStore";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fast QR Generator",
  description: "Pagina Web para creación de QR's sin limites de forma gratuita",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="abSLIjYehY7UNNtTck9OZ0lKx9FvXoWr4XvLnOBVs1M"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen max-w-screen flex`}
      >
        <TooltipProvider>{children}</TooltipProvider>
      </body>
      <Analytics />
    </html>
  );
}
