"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../../contexts/LanguageContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Button } from '../../components/ui/button';
import { ArrowLeft, CheckCircle2, Star, Phone } from 'lucide-react';
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
  const [showPhoneModal, setShowPhoneModal] = useState(false);
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (imageUrls.length === 0) return;
      if (e.key === 'ArrowLeft') {
        setActiveImage((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveImage((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageUrls.length]);

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
      <main className="flex-1 pt-32 md:pt-40 pb-32 lg:pb-16">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8 flex-wrap">
            <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium transition">
              {lang === 'uz' ? 'Bosh sahifa' : 'Главная'}
            </Link>
            <span className="text-gray-400 dark:text-gray-500">→</span>
            <Link href="/products" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium transition">
              {t('products.title')}
            </Link>
            <span className="text-gray-400 dark:text-gray-500">→</span>
            <span className="text-gray-900 dark:text-white font-semibold line-clamp-1">{name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-[3/4] relative group cursor-zoom-in">
                {imageUrls[activeImage] ? (
                  <Image
                    src={imageUrls[activeImage]}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium">
                    {lang === 'uz' ? 'Rasm yo\'q' : 'Нет изображения'}
                  </div>
                )}
                {imageUrls.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md backdrop-blur-sm transition-all z-10"
                      aria-label="Previous image"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-900" />
                    </button>
                    <button
                      onClick={() => setActiveImage((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md backdrop-blur-sm transition-all z-10"
                      aria-label="Next image"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-900 rotate-180" />
                    </button>
                  </>
                )}
              </div>

              {imageUrls.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                  {imageUrls.map((url, index) => (
                    <button
                      key={`${url}-${index}`}
                      onClick={() => setActiveImage(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === index ? 'border-amber-500 shadow-md' : 'border-gray-200 hover:border-amber-300'
                      }`}
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
                <span className="inline-flex w-fit items-center rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-amber-900 border border-amber-200">
                  {badgeLabel}
                </span>
              )}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  {name}
                </h1>

                {ratingCount > 0 && (
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-5 h-5 ${s <= Math.round(ratingAverage) ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-base font-semibold text-gray-900 dark:text-white">
                      {ratingAverage.toFixed(1)} ({ratingCount} {lang === 'uz' ? 'sharh' : 'отзывов'})
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-baseline gap-4">
                <p className="text-4xl font-bold text-amber-600">
                  {Number(product.price).toLocaleString()} {lang === 'uz' ? "so'm" : "сум"}
                </p>
                {product.oldPrice && (
                  <p className="text-xl text-gray-500 line-through font-medium">
                    {Number(product.oldPrice).toLocaleString()} {lang === 'uz' ? "so'm" : "сум"}
                  </p>
                )}
              </div>

              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{lang === 'uz' ? 'Yetkazib berish' : 'Доставка'}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{lang === 'uz' ? '3-5 ish kuni' : '3-5 рабочих дней'}</p>
                </div>
                <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{lang === 'uz' ? 'Kafolat' : 'Гарантия'}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{lang === 'uz' ? 'Rasmiy kafolat mavjud' : 'Официальная гарантия'}</p>
                </div>
                <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{lang === 'uz' ? 'O\'rnatish' : 'Установка'}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{lang === 'uz' ? 'Professional xizmat' : 'Профессиональный сервис'}</p>
                </div>
              </div>

              {specs.length > 0 && (
                <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('detail.specifications')}</h3>
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    {specs.map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-gray-600 dark:text-gray-400 font-medium text-xs uppercase tracking-wide mb-1">{label}</p>
                        <p className="font-bold text-gray-900 dark:text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-gray-700"><CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /><span className="font-medium">{lang === 'uz' ? 'Shartnoma asosida ishlaymiz' : 'Работаем по договору'}</span></p>
                <p className="flex items-center gap-2 text-gray-700"><CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /><span className="font-medium">{lang === 'uz' ? 'Sotuvdan keyingi qo\'llab-quvvatlash' : 'Поддержка после покупки'}</span></p>
              </div>
            </div>
          </div>

          {/* Sticky CTA Section */}
          <div className="fixed bottom-0 left-0 right-0 lg:relative z-50 lg:z-auto bg-white dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700 p-4 md:p-6 lg:p-0 lg:border-0 lg:shadow-none shadow-2xl">
            <div className="container mx-auto px-4 md:px-8 lg:px-16">
              <div className="flex gap-2 md:gap-3 lg:gap-4">
                <button
                  onClick={() => setLeadOpen(true)}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-3 md:py-3.5 px-6 md:px-8 rounded-lg md:rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-md text-sm md:text-base"
                >
                  {t('detail.leaveRequest')}
                </button>
                <button
                  onClick={() => setShowPhoneModal(true)}
                  className="flex-1 inline-flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-800 font-bold py-3 md:py-3.5 px-6 md:px-8 rounded-lg md:rounded-xl hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-200 text-sm md:text-base"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">{lang === 'uz' ? 'Qo\'ng\'iroq' : 'Звонок'}</span>
                  <span className="sm:hidden">{lang === 'uz' ? '+998' : '+998'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Phone Modal */}
          {showPhoneModal && (
            <div
              className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
              onClick={() => setShowPhoneModal(false)}
            >
              <div
                className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {lang === 'uz' ? 'Filial tanlang' : 'Выберите филиал'}
                  </h3>
                  <button
                    onClick={() => setShowPhoneModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Branches */}
                <div className="space-y-3">
                  {[
                    { name: lang === 'uz' ? "Toshkent" : "Ташкент", phone: "+998 50 711 00 64", hours: "9:00–19:00" },
                    { name: lang === 'uz' ? "Qo'qon" : "Коканд", phone: "+998 77 221 84 84", hours: "9:00–19:00" },
                    { name: lang === 'uz' ? "Buxoro" : "Бухара", phone: "+998 91 403 20 70", hours: "9:00–19:00" },
                  ].map((branch) => (
                    <a
                      key={branch.name}
                      href={`tel:${branch.phone.replace(/\s/g, '')}`}
                      className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-200 group"
                    >
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white group-hover:text-amber-600">
                          {branch.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {branch.hours}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-medium text-amber-600">
                          {branch.phone}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{lang === 'uz' ? 'Qo\'ng\'iroq →' : 'Звонок →'}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <section className="mt-24 pt-16 border-t-2 border-gray-200 dark:border-gray-700">
            <div className="grid lg:grid-cols-2 gap-10">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                  {lang === 'uz' ? 'Mijozlar sharhlari' : 'Отзывы клиентов'}
                </h2>
                <div className="space-y-4">
                  {(product.comments || []).length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400 text-base">
                      {lang === 'uz' ? 'Hozircha sharh yo\'q. Birinchi bo\'lib sharh qoldiring.' : 'Пока нет отзывов. Оставьте первый комментарий.'}
                    </p>
                  ) : (
                    (product.comments || []).slice(0, 8).map((comment) => (
                      <div key={comment.id} className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-base font-bold text-gray-900 dark:text-white mb-2">{comment.authorName || (lang === 'uz' ? 'Foydalanuvchi' : 'Пользователь')}</p>
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className={`w-4 h-4 ${s <= comment.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`} />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{new Date(comment.createdAt).toLocaleDateString(lang === 'uz' ? 'uz-UZ' : 'ru-RU')}</span>
                        </div>
                        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 h-fit sticky top-28">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  {lang === 'uz' ? 'Sharh qoldiring' : 'Оставьте отзыв'}
                </h3>

                <div className="mb-5">
                  <p className="text-sm font-bold text-gray-700 mb-3">{lang === 'uz' ? 'Baho' : 'Оценка'}</p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => setReviewRating(s)} className="transition-transform hover:scale-110">
                        <Star className={`w-7 h-7 ${s <= reviewRating ? 'text-amber-500 fill-current' : 'text-gray-300'}`} />
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
                    className="w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-amber-500 dark:focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>

                <div className="mb-4">
                  <Textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder={lang === 'uz' ? 'Sharhingizni yozing...' : 'Напишите ваш комментарий...'}
                    className="min-h-28 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>

                {reviewError && <p className="text-sm text-red-600 font-medium mb-3">{reviewError}</p>}

                <button
                  onClick={addReview}
                  disabled={reviewSubmitting}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-3 rounded-lg hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-base"
                >
                  {reviewSubmitting
                    ? (lang === 'uz' ? 'Yuborilmoqda...' : 'Отправка...')
                    : (lang === 'uz' ? 'Sharh yuborish' : 'Отправить отзыв')}
                </button>
              </div>
            </div>
          </section>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-24">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{t('detail.relatedProducts')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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