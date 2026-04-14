"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { productsAPI } from '@/lib/api-client';
import { Button } from '../components/ui/button';
import Link from 'next/link';
import ProductCard from './ProductCard';

interface ApiProduct {
  id: string;
  nameUz: string;
  nameRu: string;
  price: string;
  images: string[];
  attributes: Record<string, string>;
  category: { id: string; nameUz: string; nameRu: string };
}

const ProductsPreview = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<ApiProduct[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await productsAPI.getAll({ limit: 4 });
        if (res.success) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
    fetch();
  }, []);

  return (
    <section className="py-20 lg:py-28 bg-cream">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16 text-foreground">
          {t('products.title')}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/products">
            <Button variant="hero">{t('products.viewAll')}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsPreview;