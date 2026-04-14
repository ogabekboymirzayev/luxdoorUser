"use client";

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { productsAPI } from '@/lib/api-client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { X, SlidersHorizontal } from 'lucide-react';

type SortOption = 'default' | 'price-asc' | 'price-desc';

interface ApiProduct {
  id: string;
  nameUz: string;
  nameRu: string;
  price: string;
  images: string[];
  attributes: Record<string, string>;
  category: { id: string; nameUz: string; nameRu: string };
}

interface Category {
  id: string;
  nameUz: string;
  nameRu: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ProductsPage() {
  const { t, lang } = useLanguage();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceMin, setPriceMin] = useState<number | null>(null);
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>('default');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          productsAPI.getAll({ limit: 100 }),
          fetch(`${API_URL}/api/categories`, { credentials: 'include' }).then(r => r.json()),
        ]);
        if (productsRes.success) setProducts(productsRes.data.products);
        if (categoriesRes.success) setCategories(categoriesRes.data);
      } catch (err) {
        console.error('Failed to fetch:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const resetFilters = () => {
    setPriceMin(null);
    setPriceMax(null);
    setMinInput('');
    setMaxInput('');
    setSelectedCategories([]);
    setSort('default');
  };

  const handleMinBlur = () => {
    const val = parseInt(minInput.replace(/\s/g, ''));
    if (!isNaN(val) && val >= 0) {
      setPriceMin(val);
    } else {
      setPriceMin(null);
      setMinInput('');
    }
  };

  const handleMaxBlur = () => {
    const val = parseInt(maxInput.replace(/\s/g, ''));
    if (!isNaN(val) && val >= 0) {
      setPriceMax(val);
    } else {
      setPriceMax(null);
      setMaxInput('');
    }
  };

  const hasActiveFilters =
    priceMin !== null ||
    priceMax !== null ||
    selectedCategories.length > 0;

  const filtered = useMemo(() => {
    const result = products.filter((p) => {
      const price = Number(p.price);
      if (priceMin !== null && price < priceMin) return false;
      if (priceMax !== null && price > priceMax) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category?.id)) return false;
      return true;
    });
    if (sort === 'price-asc') return [...result].sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === 'price-desc') return [...result].sort((a, b) => Number(b.price) - Number(a.price));
    return result;
  }, [products, priceMin, priceMax, selectedCategories, sort]);

  // Filter JSX — komponent emas, o'zgaruvchi sifatida
  const filterContent = (
    <div className="space-y-8">

      {/* Kategoriya */}
      {categories.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-3 text-foreground">
            {lang === 'uz' ? 'Kategoriya' : 'Категория'}
          </h4>
          <div className="space-y-1">
            {categories.map((cat) => {
              const isActive = selectedCategories.includes(cat.id);
              const catName = lang === 'uz' ? cat.nameUz : cat.nameRu;
              const count = products.filter(p => p.category?.id === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`flex items-center justify-between w-full text-left text-sm px-3 py-2 rounded-md transition-colors ${isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                    }`}
                >
                  <span>{catName}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-muted'
                    }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Narx */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          {t('products.filter.price')}
        </p>

        <div className="flex items-stretch border border-border rounded-lg overflow-hidden bg-background">
          <div className="flex flex-col flex-1 px-3 py-2 min-w-0">
            <span className="text-[10px] text-muted-foreground mb-0.5">dan</span>
            <input
              type="text"
              inputMode="numeric"
              value={minInput}
              placeholder="0"
              onChange={(e) => setMinInput(e.target.value)}
              onBlur={handleMinBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleMinBlur()}
              className="bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/40 outline-none w-full"
            />
          </div>

          <div className="w-px bg-border self-stretch" />

          <div className="flex flex-col flex-1 px-3 py-2 min-w-0">
            <span className="text-[10px] text-muted-foreground mb-0.5">gacha</span>
            <input
              type="text"
              inputMode="numeric"
              value={maxInput}
              placeholder="10 000 000"
              onChange={(e) => setMaxInput(e.target.value)}
              onBlur={handleMaxBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleMaxBlur()}
              className="bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/40 outline-none w-full"
            />
          </div>
        </div>

        {(priceMin !== null || priceMax !== null) && (
          <p className="text-xs text-muted-foreground mt-2">
            {priceMin !== null ? priceMin.toLocaleString() : '0'} —{' '}
            {priceMax !== null ? priceMax.toLocaleString() : '∞'} so'm
          </p>
        )}

        {hasActiveFilters && (
          <Button variant="outline" className="w-full mt-4" onClick={resetFilters}>
            {t('products.filter.reset')}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-8 text-foreground">
            {t('products.title')}
          </h1>

          <div className="flex items-center justify-between mb-8 gap-4">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="lg:hidden flex items-center gap-2 text-sm font-medium border border-border px-4 py-2 rounded-md text-foreground"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {t('products.filter.title')}
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-gold" />}
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="text-sm border border-border rounded-md px-3 py-2 bg-background text-foreground"
            >
              <option value="default">{t('products.filter.sort')}</option>
              <option value="price-asc">{t('products.filter.sortLowHigh')}</option>
              <option value="price-desc">{t('products.filter.sortHighLow')}</option>
            </select>
          </div>

          <div className="flex gap-8">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 self-start">
              <h3 className="text-lg font-semibold mb-6 text-foreground">{t('products.filter.title')}</h3>
              {filterContent}
            </aside>

            {/* Mobile filters */}
            {filtersOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-foreground/30" onClick={() => setFiltersOpen(false)} />
                <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-background p-6 overflow-y-auto shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-foreground">{t('products.filter.title')}</h3>
                    <button onClick={() => setFiltersOpen(false)}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {filterContent}
                </div>
              </div>
            )}

            {/* Product grid */}
            <div className="flex-1">
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedCategories.map(id => {
                    const cat = categories.find(c => c.id === id);
                    if (!cat) return null;
                    return (
                      <span key={id} className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                        {lang === 'uz' ? cat.nameUz : cat.nameRu}
                        <button onClick={() => toggleCategory(id)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                  {(priceMin !== null || priceMax !== null) && (
                    <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {priceMin?.toLocaleString() ?? '0'} — {priceMax?.toLocaleString() ?? '∞'} so'm
                      <button onClick={() => { setPriceMin(null); setPriceMax(null); setMinInput(''); setMaxInput(''); }}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {loading ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="rounded-xl bg-muted animate-pulse aspect-[3/4]" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-4xl mb-3">🔍</p>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {lang === 'uz' ? 'Mahsulot topilmadi' : 'Товары не найдены'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    {lang === 'uz' ? (
                      <>Filtr shartlariga mos mahsulot mavjud emas.<br />Iltimos, boshqa parametrlarni sinab ko'ring.</>
                    ) : (
                      <>По заданным фильтрам товаров не найдено.<br />Пожалуйста, попробуйте другие параметры.</>
                    )}
                  </p>
                  <Button variant="outline" onClick={resetFilters}>
                    {lang === 'uz' ? 'Filtrni tozalash' : 'Сбросить фильтры'}
                  </Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}