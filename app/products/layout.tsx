import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Temir va MDF Eshiklar | Musa Doors Toshkent",
  description: "Toshkentda temir kirish eshiklari, MDF xona eshiklari, panel eshiklar. Arzon narx, kafolat va bepul o'rnatish xizmati. +998 77 221 84 84",
  keywords: ["temir eshik", "MDF eshik", "kirish eshigi", "xona eshigi", "eshik Toshkent", "eshik narxi", "panel eshik", "eshik o'rnatish", "temir eshik narxi", "MDF eshik narxi Toshkent"],
  openGraph: {
    title: "Temir va MDF Eshiklar | Musa Doors",
    description: "Toshkentda eng sifatli temir va MDF eshiklar. Bepul o'rnatish.",
    url: "https://musadoors.uz/products",
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
