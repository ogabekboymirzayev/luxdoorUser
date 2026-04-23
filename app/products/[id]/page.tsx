"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../../contexts/LanguageContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Button } from '../../components/ui/button';
import { ArrowLeft, CheckCircle2, Star } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import LeadFormModal from '../../components/LeadFormModal';
import ProductCard from '../../components/ProductCard';
import { commentsAPI, productsAPI } from '@/lib/api-client';
import { Textarea } from '../../components/ui/textarea';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiProduct {
  id: string;
  nameUz: string;
  nameRu: string;
  descriptionUz: string;
  descriptionRu: string;
  price: string;
  oldPrice?: string | null;
  badgeType?: 'NONE' | 'SALE' | 'NEW' | 'HIT';
  badgeTextUz?: string | null;
  badgeTextRu?: string | null;
  images: string[];
  attributes: Record<string, string>;
  category: { id: string; nameUz: string; nameRu: string };
  comments: ApiComment[];
  ratingSummary?: {
    average: number;
    count: number;
  };
  relatedProducts?: ApiProduct[];
}

interface ApiComment {
  id: string;
  authorName: string;
  text: string;
  rating: number;
  createdAt: string;
}

type ApiErrorShape = {
  response?: {
    data?: {
      error?: string;
    };
  };
};

type ProductJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'Product';
  name: string;
  description: string;
  image: string[];
  sku: string;
  category?: string;
  offers: {
    '@type': 'Offer';
    priceCurrency: 'UZS';
    price: number;
    availability: 'https://schema.org/InStock';
    itemCondition: 'https://schema.org/NewCondition';
  };
  brand?: {
    '@type': 'Brand';
    name: string;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
  };
};

export default function ProductDetailPage() {
  const params = useParams();
  const id = decodeURIComponent(params.id as string);
  const { t, lang } = useLanguage();
  const [leadOpen, setLeadOpen] = useState(false);
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [related, setRelated] = useState<ApiProduct[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewAuthorName, setReviewAuthorName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productsAPI.getById(id);
        if (res.success) {
          setProduct(res.data);
          setRelated(res.data.relatedProducts || []);
          setActiveImage(0);
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

  const imageUrls = useMemo(() => {
    if (!product?.images?.length) return [];
    return product.images.map((img) => (img.startsWith('http') ? img : `${API_URL}${img}`));
  }, [product]);

  const ratingAverage = product?.ratingSummary?.average ?? 0;
  const ratingCount = product?.ratingSummary?.count ?? product?.comments?.length ?? 0;
  const badgeLabel =
    lang === 'uz'
      ? (product?.badgeTextUz || (product?.badgeType === 'SALE' ? 'Aksiya' : product?.badgeType === 'NEW' ? 'Yangi' : product?.badgeType === 'HIT' ? 'Hit' : ''))
      : (product?.badgeTextRu || (product?.badgeType === 'SALE' ? 'Акция' : product?.badgeType === 'NEW' ? 'Новинка' : product?.badgeType === 'HIT' ? 'Хит' : ''));

  const productJsonLd = useMemo(() => {
    if (!product) return null;

    const primaryImage = imageUrls[0] || undefined;

    const payload: ProductJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name,
      description,
      image: imageUrls,
      sku: product.id,
      category: lang === 'uz' ? product.category?.nameUz : product.category?.nameRu,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'UZS',
        price: Number(product.price),
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
      },
    };

    if (primaryImage) {
      payload.brand = {
        '@type': 'Brand',
        name: 'Musa Doors',
      };
    }

    if (ratingCount > 0) {
      payload.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: ratingAverage,
        reviewCount: ratingCount,
      };
    }

    return payload;
  }, [product, name, description, imageUrls, lang, ratingAverage, ratingCount]);

  const addReview = async () => {
    if (!product) return;

    if (reviewAuthorName.trim().length < 2) {
      setReviewError(lang === 'uz' ? 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak' : 'Имя должно содержать минимум 2 символа');
      return;
    }

    if (reviewText.trim().length < 3) {
      setReviewError(lang === 'uz' ? 'Sharh kamida 3 ta belgidan iborat bo\'lishi kerak' : 'Комментарий должен быть не менее 3 символов');
      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewError('');

      const res = await commentsAPI.create({
        productId: product.id,
        authorName: reviewAuthorName.trim(),
        text: reviewText.trim(),
        rating: reviewRating,
      });

      if (!res.success) {
        setReviewError(res.error || (lang === 'uz' ? 'Sharh yuborilmadi' : 'Комментарий не отправлен'));
        return;
      }

      const created: ApiComment = res.data;
      setProduct((prev) => {
        if (!prev) return prev;
        const nextComments = [created, ...(prev.comments || [])];
        const nextAverage = nextComments.reduce((sum, c) => sum + c.rating, 0) / nextComments.length;

        return {
          ...prev,
          comments: nextComments,
          ratingSummary: {
            average: Number(nextAverage.toFixed(1)),
            count: nextComments.length,
          },
        };
      });

      setReviewText('');
      setReviewAuthorName('');
      setReviewRating(5);
    } catch (err: unknown) {
      const normalized = err as ApiErrorShape;
      setReviewError(normalized.response?.data?.error || (lang === 'uz' ? 'Sharh yuborishda xatolik' : 'Ошибка при отправке комментария'));
    } finally {
      setReviewSubmitting(false);
    }
  };

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
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden bg-muted aspect-[3/4] relative">
                {imageUrls[activeImage] ? (
                  <Image
                    src={imageUrls[activeImage]}
                    alt={name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    {lang === 'uz' ? 'Rasm yo\'q' : 'Нет изображения'}
                  </div>
                )}
              </div>

              {imageUrls.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                  {imageUrls.map((url, index) => (
                    <button
                      key={`${url}-${index}`}
                      onClick={() => setActiveImage(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border ${activeImage === index ? 'border-primary' : 'border-border'}`}
                    >
                      <Image src={url} alt={`${name}-${index + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              {product.badgeType && product.badgeType !== 'NONE' && badgeLabel && (
                <span className="inline-flex w-fit items-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                  {badgeLabel}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                {name}
              </h1>
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-bold text-gold-dark">
                  {Number(product.price).toLocaleString()} so'm
                </p>
                {product.oldPrice && (
                  <p className="text-base text-muted-foreground line-through">
                    {Number(product.oldPrice).toLocaleString()} so'm
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= Math.round(ratingAverage) ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <span>{ratingAverage.toFixed(1)} ({ratingCount})</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-border p-3 text-sm">
                  <p className="font-semibold text-foreground">{lang === 'uz' ? 'Yetkazib berish' : 'Доставка'}</p>
                  <p className="text-muted-foreground">{lang === 'uz' ? '3-5 ish kuni' : '3-5 рабочих дней'}</p>
                </div>
                <div className="rounded-lg border border-border p-3 text-sm">
                  <p className="font-semibold text-foreground">{lang === 'uz' ? 'Kafolat' : 'Гарантия'}</p>
                  <p className="text-muted-foreground">{lang === 'uz' ? 'Rasmiy kafolat mavjud' : 'Официальная гарантия'}</p>
                </div>
                <div className="rounded-lg border border-border p-3 text-sm">
                  <p className="font-semibold text-foreground">{lang === 'uz' ? 'O\'rnatish' : 'Установка'}</p>
                  <p className="text-muted-foreground">{lang === 'uz' ? 'Professional xizmat' : 'Профессиональный сервис'}</p>
                </div>
              </div>

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
              <a href="tel:+998507110064" className="w-full inline-flex items-center justify-center rounded-md border border-border h-12 text-sm font-medium hover:bg-muted transition">
                {lang === 'uz' ? 'Tezkor qo\'ng\'iroq' : 'Быстрый звонок'}
              </a>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" />{lang === 'uz' ? 'Shartnoma asosida ishlaymiz' : 'Работаем по договору'}</p>
                <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" />{lang === 'uz' ? 'Sotuvdan keyingi qo\'llab-quvvatlash' : 'Поддержка после покупки'}</p>
              </div>
            </div>
          </div>

          <section className="mt-20">
            <div className="grid lg:grid-cols-2 gap-10">
              <div>
                <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
                  {lang === 'uz' ? 'Mijozlar sharhlari' : 'Отзывы клиентов'}
                </h2>
                <div className="space-y-4">
                  {(product.comments || []).length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      {lang === 'uz' ? 'Hozircha sharh yo\'q. Birinchi bo\'lib sharh qoldiring.' : 'Пока нет отзывов. Оставьте первый комментарий.'}
                    </p>
                  ) : (
                    (product.comments || []).slice(0, 8).map((comment) => (
                      <div key={comment.id} className="rounded-xl border border-border p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-semibold text-foreground mb-1">{comment.authorName || (lang === 'uz' ? 'Foydalanuvchi' : 'Пользователь')}</p>
                            <div className="flex items-center gap-1 text-amber-500">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className={`w-4 h-4 ${s <= comment.rating ? 'fill-current' : ''}`} />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString(lang === 'uz' ? 'uz-UZ' : 'ru-RU')}</span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-border p-5 h-fit">
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  {lang === 'uz' ? 'Sharh qoldiring' : 'Оставьте отзыв'}
                </h3>

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">{lang === 'uz' ? 'Baho' : 'Оценка'}</p>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => setReviewRating(s)}>
                        <Star className={`w-6 h-6 ${s <= reviewRating ? 'text-amber-500 fill-current' : 'text-muted-foreground'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    value={reviewAuthorName}
                    onChange={(e) => setReviewAuthorName(e.target.value)}
                    placeholder={lang === 'uz' ? 'Ismingiz' : 'Ваше имя'}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <Textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder={lang === 'uz' ? 'Sharhingizni yozing...' : 'Напишите ваш комментарий...'}
                    className="min-h-28"
                  />
                </div>

                {reviewError && <p className="text-sm text-destructive mb-3">{reviewError}</p>}

                <Button onClick={addReview} disabled={reviewSubmitting} className="w-full">
                  {reviewSubmitting
                    ? (lang === 'uz' ? 'Yuborilmoqda...' : 'Отправка...')
                    : (lang === 'uz' ? 'Sharh yuborish' : 'Отправить отзыв')}
                </Button>
              </div>
            </div>
          </section>

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
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
    </div>
  );
}