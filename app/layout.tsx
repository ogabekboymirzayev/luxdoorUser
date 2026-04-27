import { Providers } from "../app/components/Providers";
import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Musa Doors | Premium Eshiklar",
    template: "%s | Musa Doors",
  },
  description: "Musa Doors premium eshiklar katalogi: zamonaviy dizayn, sifatli material va tezkor xizmat.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: siteUrl,
    siteName: "Musa Doors",
    title: "Musa Doors | Premium Eshiklar",
    description: "Premium eshiklar katalogi va professional xizmat.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Musa Doors | Premium Eshiklar",
    description: "Premium eshiklar katalogi va professional xizmat.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}