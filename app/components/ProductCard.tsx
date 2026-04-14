import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../contexts/LanguageContext';

interface Product {
  id: string;
  nameUz: string;
  nameRu: string;
  price: string | number;
  images: string[];
}

interface ProductCardProps {
  product: Product;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const ProductCard = ({ product }: ProductCardProps) => {
  const { t, lang } = useLanguage();
  const name = lang === 'uz' ? product.nameUz : product.nameRu;
  const imageUrl = product.images?.[0]
    ? product.images[0].startsWith('http')
      ? product.images[0]                          // Cloudinary URL — to'g'ridan ishlatish
      : `${API_URL}${product.images[0]}`           // Local URL — prefix qo'shish
    : null;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block rounded-xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-300"
    >
      <div className="aspect-[3/4] overflow-hidden bg-muted relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            Rasm yo'q
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-base font-semibold text-card-foreground mb-1">{name}</h3>
        <p className="text-lg font-bold text-gold-dark mb-3">
          {Number(product.price).toLocaleString()} so'm
        </p>
        <span className="text-sm font-medium text-primary underline-offset-4 group-hover:underline">
          {t('products.viewDetails')} →
        </span>
      </div>
    </Link>
  );
};

export default ProductCard;