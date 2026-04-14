import { Providers } from "../app/components/Providers";
import "./globals.css";

export const metadata = {
  title: "Lux Door Dealer Hub",
  description: "Premium door dealer website",
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