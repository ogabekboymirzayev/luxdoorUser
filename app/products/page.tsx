"use client";

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { categoriesAPI, productsAPI } from '@/lib/api-client';
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
  _count?: { products: number };
}

export default function ProductsPage() {
  const { t, lang } = useLanguage();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [priceMin, setPriceMin] = useState<number | null>(null);
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>('default');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const hasActiveFilters =
    priceMin !== null ||
    priceMax !== null ||
    selectedCategories.length > 0 ||
    query.trim().length > 0;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRes = await categoriesAPI.getAll();
        if (categoriesRes.success) {
          setCategories(categoriesRes.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productsRes = await productsAPI.getAll({
          page,
          limit: 12,
          categoryIds: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
          search: query.trim() || undefined,
          minPrice: priceMin ?? undefined,
          maxPrice: priceMax ?? undefined,
          sort,
        });

        if (productsRes.success) {
          setProducts(productsRes.data.products);
          setTotalPages(productsRes.data.pagination.pages || 1);
          setTotalItems(productsRes.data.pagination.total || 0);
        }
      } catch (err) {
        console.error('Failed to fetch:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, selectedCategories, query, priceMin, priceMax, sort]);

  const toggleCategory = (id: string) => {
    setPage(1);
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const resetFilters = () => {
    setPage(1);
    setQuery('');
    setPriceMin(null);
    setPriceMax(null);
    setMinInput('');
    setMaxInput('');
    setSelectedCategories([]);
    setSort('default');
  };

  const handleMinBlur = () => {
    const val = parseInt(minInput.replace(/\s/g, ''));
    setPage(1);
    if (!isNaN(val) && val >= 0) {
      setPriceMin(val);
    } else {
      setPriceMin(null);
      setMinInput('');
    }
  };

  const handleMaxBlur = () => {
    const val = parseInt(maxInput.replace(/\s/g, ''));
    setPage(1);
    if (!isNaN(val) && val >= 0) {
      setPriceMax(val);
    } else {
      setPriceMax(null);
      setMaxInput('');
    }
  };

  const pageList = useMemo(() => {
    const pages: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  }, [page, totalPages]);

  // Filter JSX — komponent emas, o'zgaruvchi sifatida
  const filterContent = (
    <div className="space-y-6">

      {/* Kategoriya */}
      {categories.length > 0 && (
        <div>
          <h4 className="text-sm font-bold mb-3 text-gray-900 uppercase tracking-wide">
            {lang === 'uz' ? 'Kategoriya' : 'Категория'}
          </h4>
          <div className="space-y-1.5">
            {categories.map((cat) => {
              const isActive = selectedCategories.includes(cat.id);
              const catName = lang === 'uz' ? cat.nameUz : cat.nameRu;
              const count = cat._count?.products ?? 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`flex items-center justify-between w-full text-left text-sm px-3 py-2.5 rounded-lg transition-all font-medium ${isActive
                    ? 'bg-amber-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <span>{catName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isActive ? 'bg-white/20' : 'bg-gray-200 text-gray-600'
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
        <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">
          {t('products.filter.price')}
        </p>

        <div className="flex items-stretch border-2 border-gray-200 rounded-lg overflow-hidden bg-white hover:border-amber-200 transition-colors">
          <div className="flex flex-col flex-1 px-3 py-2 min-w-0 border-r border-gray-200">
            <span className="text-[10px] font-semibold text-gray-500 mb-0.5 uppercase">dan</span>
            <input
              type="text"
              inputMode="numeric"
              value={minInput}
              placeholder="0"
              onChange={(e) => setMinInput(e.target.value)}
              onBlur={handleMinBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleMinBlur()}
              className="bg-transparent text-sm font-semibold text-gray-900 placeholder:text-gray-400 outline-none w-full"
            />
          </div>

          <div className="flex flex-col flex-1 px-3 py-2 min-w-0">
            <span className="text-[10px] font-semibold text-gray-500 mb-0.5 uppercase">gacha</span>
            <input
              type="text"
              inputMode="numeric"
              value={maxInput}
              placeholder="10 000 000"
              onChange={(e) => setMaxInput(e.target.value)}
              onBlur={handleMaxBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleMaxBlur()}
              className="bg-transparent text-sm font-semibold text-gray-900 placeholder:text-gray-400 outline-none w-full"
            />
          </div>
        </div>

        {(priceMin !== null || priceMax !== null) && (
          <p className="text-xs text-gray-600 mt-2 font-medium">
            {priceMin !== null ? priceMin.toLocaleString() : '0'} — {' '}
            {priceMax !== null ? priceMax.toLocaleString() : '∞'} so'm
          </p>
        )}

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="w-full mt-4 border-2 border-gray-300 text-gray-900 font-semibold py-2.5 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all text-sm"
          >
            {t('products.filter.reset')}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 md:pt-40 pb-16">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 tracking-tight">
            {t('products.title')}
          </h1>

          <div className="mb-6">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setPage(1);
                setQuery(e.target.value);
              }}
              placeholder={lang === 'uz' ? 'Mahsulot qidirish...' : 'Поиск товаров...'}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>

          <div className="flex items-center justify-between mb-8 gap-4">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="lg:hidden flex items-center gap-2 text-sm font-semibold border-2 border-gray-300 px-4 py-2.5 rounded-lg text-gray-900 hover:border-amber-500 hover:bg-amber-50 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {t('products.filter.title')}
              {hasActiveFilters && <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
            </button>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs font-semibold text-gray-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                {totalItems} {lang === 'uz' ? 'mahsulot' : 'товаров'}
              </span>

              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => {
                    setPage(1);
                    setSort(e.target.value as SortOption);
                  }}
                  className="appearance-none text-sm font-medium border-2 border-gray-200 rounded-lg px-4 py-2.5 bg-white text-gray-900 hover:border-amber-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer pr-8"
                >
                  <option value="default">{t('products.filter.sort')}</option>
                  <option value="price-asc">{t('products.filter.sortLowHigh')}</option>
                  <option value="price-desc">{t('products.filter.sortHighLow')}</option>
                </select>
                <SlidersHorizontal className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop sidebar - Collapsible */}
            <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-28 self-start">
              <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
                <h3 className="text-lg font-bold mb-6 text-gray-900">{t('products.filter.title')}</h3>
                {filterContent}
              </div>
            </aside>

            {/* Mobile filters - Drawer */}
            {filtersOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
                <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white p-6 overflow-y-auto shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">{t('products.filter.title')}</h3>
                    <button onClick={() => setFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <X className="w-5 h-5 text-gray-600" />
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
                      <span key={id} className="inline-flex items-center gap-1.5 text-xs bg-amber-100 text-amber-900 px-3 py-1.5 rounded-full font-medium border border-amber-200">
                        {lang === 'uz' ? cat.nameUz : cat.nameRu}
                        <button onClick={() => toggleCategory(id)} className="hover:opacity-70 transition">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    );
                  })}
                  {(priceMin !== null || priceMax !== null) && (
                    <span className="inline-flex items-center gap-1.5 text-xs bg-amber-100 text-amber-900 px-3 py-1.5 rounded-full font-medium border border-amber-200">
                      {priceMin?.toLocaleString() ?? '0'} — {priceMax?.toLocaleString() ?? '∞'} so'm
                      <button onClick={() => { setPriceMin(null); setPriceMax(null); setMinInput(''); setMaxInput(''); }} className="hover:opacity-70 transition">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              <div className="text-sm font-semibold text-gray-600 mb-6 sm:hidden">
                {lang === 'uz' ? `Jami: ${totalItems} ta mahsulot` : `Всего: ${totalItems} товаров`}
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="rounded-2xl bg-gray-200 animate-pulse aspect-[3/4]" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-24">
                  <p className="text-6xl mb-4">🔍</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {lang === 'uz' ? 'Mahsulot topilmadi' : 'Товары не найдены'}
                  </h3>
                  <p className="text-base text-gray-600 mb-8 max-w-md mx-auto">
                    {lang === 'uz' ? (
                      <>Filtr shartlariga mos mahsulot mavjud emas.<br />Iltimos, boshqa parametrlarni sinab ko'ring.</>
                    ) : (
                      <>По заданным фильтрам товаров не найдено.<br />Пожалуйста, попробуйте другие параметры.</>
                    )}
                  </p>
                  <Button variant="outline" onClick={resetFilters} className="border-2 border-gray-300 text-gray-900 hover:bg-gray-100">
                    {lang === 'uz' ? 'Filtrni tozalash' : 'Сбросить фильтры'}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
                      <button
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="px-4 py-2.5 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-amber-500 hover:bg-amber-50 transition-all"
                      >
                        {lang === 'uz' ? 'Oldingi' : 'Назад'}
                      </button>
                      {pageList.map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`px-4 py-2.5 rounded-lg font-semibold transition-all ${
                            p === page
                              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md'
                              : 'border-2 border-gray-300 text-gray-900 hover:border-amber-500 hover:bg-amber-50'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        className="px-4 py-2.5 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-amber-500 hover:bg-amber-50 transition-all"
                      >
                        {lang === 'uz' ? 'Keyingi' : 'Далее'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}