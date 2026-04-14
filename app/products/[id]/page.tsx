"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../../contexts/LanguageContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import LeadFormModal from '../../components/LeadFormModal';
import ProductCard from '../../components/ProductCard';
import { productsAPI } from '@/lib/api-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiProduct {
  id: string;
  nameUz: string;
  nameRu: string;
  descriptionUz: string;
  descriptionRu: string;
  price: string;
  images: string[];
  attributes: Record<string, string>;
  category: { id: string; nameUz: string; nameRu: string };
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = decodeURIComponent(params.id as string);
  const { t, lang } = useLanguage();
  const [leadOpen, setLeadOpen] = useState(false);
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [related, setRelated] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productsAPI.getById(id);
        if (res.success) {
          setProduct(res.data);

          const allRes = await productsAPI.getAll({ limit: 100 });
          if (allRes.success) {
            const others = allRes.data.products.filter(
              (p: ApiProduct) => p.id !== res.data.id &&
              p.category?.id === res.data.category?.id
            ).slice(0, 3);
            setRelated(others);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // ✅ lang o'zgarganda qayta hisoblanadi
  const name = useMemo(() => {
    if (!product) return '';
    return lang === 'uz' ? product.nameUz : product.nameRu;
  }, [product, lang]);

  const description = useMemo(() => {
    if (!product) return '';
    return lang === 'uz' ? product.descriptionUz : product.descriptionRu;
  }, [product, lang]);

  const specs = useMemo(() => {
    if (!product) return [];
    return Object.entries(product.attributes ?? {}).map(([key, value]) => {
      const keyParts = key.split('||');
      const valParts = value.split('||');
      return {
        label: lang === 'uz' ? keyParts[0] : (keyParts[1] || keyParts[0]),
        value: lang === 'uz' ? valParts[0] : (valParts[1] || valParts[0]),
      };
    });
  }, [product, lang]);

  const imageUrl = useMemo(() => {
    if (!product?.images?.[0]) return null;
    return product.images[0].startsWith('http')
      ? product.images[0]
      : `${API_URL}${product.images[0]}`;
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-20">
          <p className="text-muted-foreground">Mahsulot yuklanmoqda...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-20">
          <p className="text-muted-foreground">Mahsulot topilmadi</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            {t('products.title')}
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="rounded-xl overflow-hidden bg-muted aspect-[3/4] relative">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                  Rasm yo'q
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                {name}
              </h1>
              <p className="text-3xl font-bold text-gold-dark">
                {Number(product.price).toLocaleString()} so'm
              </p>
              <p className="text-muted-foreground leading-relaxed">{description}</p>

              {specs.length > 0 && (
                <div className="border-t border-border pt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">{t('detail.specifications')}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {specs.map(({ label, value }) => (
                      <div key={label}>
                        <span className="text-muted-foreground">{label}</span>
                        <p className="font-medium text-foreground">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button variant="gold" size="lg" className="w-full text-base h-14 mt-4" onClick={() => setLeadOpen(true)}>
                {t('detail.leaveRequest')}
              </Button>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-display font-bold mb-8 text-foreground">{t('detail.relatedProducts')}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <LeadFormModal open={leadOpen} onOpenChange={setLeadOpen} productName={name} />
    </div>
  );
}