import type { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type RouteParams = {
  id: string;
};

export async function generateMetadata(
  { params }: { params: Promise<RouteParams> }
): Promise<Metadata> {
  const { id } = await params;
  const productId = decodeURIComponent(id);

  try {
    const response = await fetch(`${API_URL}/api/products/${encodeURIComponent(productId)}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        title: "Mahsulot topilmadi",
        alternates: { canonical: `/products/${encodeURIComponent(productId)}` },
      };
    }

    const payload = await response.json();
    const product = payload?.data;

    if (!product) {
      return {
        title: "Mahsulot topilmadi",
        alternates: { canonical: `/products/${encodeURIComponent(productId)}` },
      };
    }

    const title = `${product.nameUz} | Musa Doors`;
    const description = (product.descriptionUz || "Premium eshik mahsuloti").slice(0, 160);
    const image = Array.isArray(product.images) && product.images[0]
      ? (product.images[0].startsWith("http") ? product.images[0] : `${API_URL}${product.images[0]}`)
      : undefined;

    return {
      title,
      description,
      alternates: {
        canonical: `/products/${encodeURIComponent(productId)}`,
      },
      openGraph: {
        type: "website",
        title,
        description,
        url: `${SITE_URL}/products/${encodeURIComponent(productId)}`,
        images: image ? [{ url: image }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: image ? [image] : undefined,
      },
    };
  } catch {
    return {
      title: "Mahsulot",
      alternates: { canonical: `/products/${encodeURIComponent(productId)}` },
    };
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
