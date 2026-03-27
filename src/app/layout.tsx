import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

import { Righteous } from "next/font/google";
import "./globals.css";
import content from "@/content/content.json";
import { TooltipProvider } from "@/components/ui/tooltip";

const righteous = Righteous({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: content.metadata.title,
  applicationName: content.metadata.applicationName,
  description: content.metadata.description,
  authors: content.metadata.authors,
  metadataBase: new URL("https://fastqrmaster.vercel.app"),
  openGraph: content.metadata.openGraph,
  verification: {
    google: "abSLIjYehY7UNNtTck9OZ0lKx9FvXoWr4XvLnOBVs1M",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${righteous.className}  antialiased md:h-screen max-w-screen flex`}
      >
        <TooltipProvider>{children}</TooltipProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Fast QR Master",
              operatingSystem: "All",
              applicationCategory: "DesignApplication",
              description:
                "Generador de códigos QR gratuito y personalizable para enlaces, redes sociales y redes WiFi.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Person",
                name: "Diego Torres",
                url: "https://diegotorres-portfoliodev.vercel.app",
              },
            }),
          }}
        />
      </body>
      <Analytics />
    </html>
  );
}
