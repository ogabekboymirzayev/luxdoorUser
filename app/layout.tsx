import { Providers } from "../app/components/Providers";
import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  verification: {
    google: "ln-moYfyek346DIMWE32xHbgQLC7i-TTLadn2WR1DHM",
  },
  metadataBase: new URL(siteUrl),
  title: {
    default: "Musa Doors | Temir va MDF Eshiklar Toshkent",
    template: "%s | Musa Doors",
  },
  description: "Toshkentda eng sifatli temir va MDF eshiklar. Kirish eshiklari, xona eshiklari, panel eshiklar. Arzon narx, bepul o'rnatish.",
  keywords: ["temir eshik", "MDF eshik", "eshik Toshkent", "kirish eshigi", "xona eshigi", "panel eshik", "eshik narxi", "eshik o'rnatish", "Musa Doors"],
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