import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    const response = await fetch(`${API_URL}/api/products?page=1&limit=1000`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return staticPages;
    }

    const payload = await response.json();
    const products = payload?.data?.products || [];

    const productPages: MetadataRoute.Sitemap = products.map((product: { id: string; updatedAt?: string }) => ({
      url: `${SITE_URL}/products/${encodeURIComponent(product.id)}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticPages, ...productPages];
  } catch {
    return staticPages;
  }
}
