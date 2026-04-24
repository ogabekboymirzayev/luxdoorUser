"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { productsAPI } from '@/lib/api-client';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { ArrowRight } from 'lucide-react';

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
    const fetchProducts = async () => {
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
    fetchProducts();
  }, []);

  return (
    <section className="py-24 lg:py-32 bg-cream relative overflow-hidden">
      {/* Decoration */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-gold/6 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-primary/4 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="section-label mb-3 block">
              {lang === 'uz' ? 'Kolleksiya' : 'Коллекция'}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight">
              {t('products.title') as string}
            </h2>
            <div className="gold-divider mt-4" />
          </div>
          <p className="text-muted-foreground max-w-xs leading-relaxed text-sm md:text-base md:text-right">
            {t('products.subtitle') as string}
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-muted/60 animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="max-w-lg mx-auto text-center rounded-2xl border border-border bg-card p-12 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-gold-soft border border-gold/20 flex items-center justify-center text-2xl">
              📦
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {lang === 'uz' ? 'Hozircha mahsulotlar qo\'shilmagan' : 'Пока товары не добавлены'}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {lang === 'uz'
                ? 'Yaqin orada yangi kolleksiyalarni joylaymiz. So\'rov qoldirsangiz, birinchi bo\'lib sizga xabar beramiz.'
                : 'Скоро добавим новые коллекции. Оставьте заявку, и мы свяжемся с вами первыми.'}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-14">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 shadow-md"
          >
            {t('products.viewAll') as string}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsPreview;
