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
  const { t, lang } = useLanguage();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await productsAPI.getAll({ limit: 4 });
        if (res.success) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
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

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl bg-muted animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center rounded-2xl border border-border bg-card p-10">
            <p className="text-4xl mb-3">📦</p>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {lang === 'uz' ? 'Hozircha mahsulotlar qo\'shilmagan' : 'Пока товары не добавлены'}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {lang === 'uz'
                ? 'Yaqin orada yangi kolleksiyalarni joylaymiz. So\'rov qoldirsangiz, birinchi bo\'lib sizga xabar beramiz.'
                : 'Скоро добавим новые коллекции. Оставьте заявку, и мы свяжемся с вами первыми.'}
            </p>
            <Button variant="gold">{t('nav.leaveRequest')}</Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

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