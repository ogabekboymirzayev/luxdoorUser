import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../contexts/LanguageContext';
import { Star, Eye } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: string;
  nameUz: string;
  nameRu: string;
  price: string | number;
  oldPrice?: string | number | null;
  badgeType?: 'NONE' | 'SALE' | 'NEW' | 'HIT';
  badgeTextUz?: string | null;
  badgeTextRu?: string | null;
  images: string[];
  ratingSummary?: {
    average: number;
    count: number;
  };
  comments?: {
    rating: number;
  }[];
}

interface ProductCardProps {
  product: Product;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const TASHKENT_PHONE = '+998507110064';

const ProductCard = ({ product }: ProductCardProps) => {
  const { t, lang } = useLanguage();
  const [isHovering, setIsHovering] = useState(false);
  const name = lang === 'uz' ? product.nameUz : product.nameRu;
  const badgeLabel =
    lang === 'uz'
      ? (product.badgeTextUz || (product.badgeType === 'SALE' ? 'Aksiya' : product.badgeType === 'NEW' ? 'Yangi' : product.badgeType === 'HIT' ? 'Hit' : ''))
      : (product.badgeTextRu || (product.badgeType === 'SALE' ? 'Акция' : product.badgeType === 'NEW' ? 'Новинка' : product.badgeType === 'HIT' ? 'Хит' : ''));
  const imageUrl = product.images?.[0]
    ? product.images[0].startsWith('http')
      ? product.images[0]                          // Cloudinary URL — to'g'ridan ishlatish
      : `${API_URL}${product.images[0]}`           // Local URL — prefix qo'shish
    : null;

  const ratingCount = product.ratingSummary?.count ?? product.comments?.length ?? 0;
  const ratingAverage = product.ratingSummary?.average ?? (
    product.comments?.length
      ? product.comments.reduce((sum, comment) => sum + comment.rating, 0) / product.comments.length
      : 0
  );

  return (
    <div className="group h-full rounded-2xl overflow-hidden border border-gray-100 bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
      {/* Image container */}
      <div
        className="aspect-[3/4] overflow-hidden bg-gray-100 relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {product.badgeType && product.badgeType !== 'NONE' && badgeLabel && (
          <span className="absolute left-3 top-3 z-20 rounded-full bg-amber-500 px-3 py-1 text-[11px] font-bold text-white shadow-md">
            {badgeLabel}
          </span>
        )}

        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium">
            {lang === 'uz' ? 'Rasm yo\'q' : 'Нет изображения'}
          </div>
        )}

        {/* Overlay with "Ko'rish" button */}
        {isHovering && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 transition-opacity duration-300">
            <Link href={`/products/${product.id}`}>
              <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg">
                <Eye className="w-4 h-4" />
                {lang === 'uz' ? 'Ko\'rish' : 'Просмотр'}
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">{name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-3.5 h-3.5 ${s <= Math.round(ratingAverage) ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600 font-medium">
            {ratingAverage > 0 ? ratingAverage.toFixed(1) : '0.0'} ({ratingCount})
          </span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <p className="text-xl font-bold text-amber-600">
            {Number(product.price).toLocaleString()} {lang === 'uz' ? "so'm" : "сум"}
          </p>
          {product.oldPrice && (
            <p className="text-sm text-gray-500 line-through">
              {Number(product.oldPrice).toLocaleString()} {lang === 'uz' ? "so'm" : "сум"}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 mt-auto">
          <Link href={`/products/${product.id}`}>
            <button className="w-full border-2 border-gray-300 text-gray-900 font-semibold py-2.5 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all duration-200 text-sm">
              {t('products.viewDetails')}
            </button>
          </Link>
          <button
            onClick={() => {
              window.location.href = `tel:${TASHKENT_PHONE}`;
            }}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold py-2.5 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 text-sm shadow-md"
          >
            {lang === 'uz' ? 'Buyurtma berish' : 'Заказать'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;