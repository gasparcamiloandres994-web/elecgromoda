import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Product, FilterState, CartItem, CategoryId } from './types';
import { PRODUCTS } from './data/products';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { BrandShowcase } from './components/BrandShowcase';
import { SearchAndFilterBar } from './components/SearchAndFilterBar';
import { FilterSidebar } from './components/FilterSidebar';
import { CartBoxWidget } from './components/CartBoxWidget';
import { DbOrdersModal } from './components/DbOrdersModal';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CompareModal } from './components/CompareModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Toast, ToastMessage } from './components/Toast';
import { Footer } from './components/Footer';
import { SlidersHorizontal, PackageX, Database, CheckCircle2 } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  category: 'todos',
  brands: [],
  minPrice: 0,
  maxPrice: 3000,
  energyRatings: [],
  onlyInStock: false,
  onlyFreeShipping: false,
  onlyOffers: false,
  onlyWifi: false,
  sortBy: 'featured',
};

export default function App() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('electronova_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [comparedProductIds, setComparedProductIds] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [dbOrdersCount, setDbOrdersCount] = useState<number>(0);

  const catalogRef = useRef<HTMLDivElement>(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('electronova_cart', JSON.stringify(cart));
    } catch {
      // Ignore
    }
  }, [cart]);

  // Fetch count of saved orders in Neon DB
  const refreshDbOrdersCount = useCallback(async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setDbOrdersCount(data.orders.length);
      }
    } catch {
      // Ignore offline
    }
  }, []);

  useEffect(() => {
    refreshDbOrdersCount();
  }, [refreshDbOrdersCount]);

  const addToast = (title: string, subtitle?: string, type: ToastMessage['type'] = 'cart') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, subtitle, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateFilters = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handleSelectBrandInShowcase = (brand: string) => {
    setFilters((prev) => {
      const isAlreadySelected = prev.brands.includes(brand);
      return {
        ...prev,
        brands: isAlreadySelected ? prev.brands.filter((b) => b !== brand) : [...prev.brands, brand],
      };
    });
    scrollToCatalog();
  };

  const handleSelectCategory = (cat: CategoryId) => {
    setFilters((prev) => ({ ...prev, category: cat }));
    scrollToCatalog();
  };

  const scrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    addToast(
      'Añadido a la casilla del carrito',
      `${quantity}x ${product.name} (${product.brand})`,
      'cart'
    );
  };

  // Action: "Comprar Producto" (Buy Product directly and open checkout to save in DB)
  const handleBuyNow = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Comparison operations
  const handleToggleCompare = (product: Product) => {
    setComparedProductIds((prev) => {
      if (prev.includes(product.id)) {
        addToast('Quitado del comparador', product.name, 'compare');
        return prev.filter((id) => id !== product.id);
      }
      if (prev.length >= 4) {
        addToast('Límite alcanzado', 'Puedes comparar un máximo de 4 electrodomésticos', 'info');
        return prev;
      }
      addToast('Añadido al comparador', `${product.brand} - ${product.name}`, 'compare');
      return [...prev, product.id];
    });
  };

  const handleRemoveCompared = (productId: string) => {
    setComparedProductIds((prev) => prev.filter((id) => id !== productId));
  };

  const handleClearCompared = () => {
    setComparedProductIds([]);
  };

  // Coupons
  const handleApplyCoupon = (code: string): boolean => {
    const cleanCode = code.toUpperCase().trim();
    if (cleanCode === 'ELECTRO10' || cleanCode === 'BIENVENIDA' || cleanCode === 'VERANO') {
      setAppliedCoupon(cleanCode);
      return true;
    }
    return false;
  };

  // Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon === 'ELECTRO10') return Math.round(cartSubtotal * 0.1);
    if (appliedCoupon === 'VERANO') return Math.round(cartSubtotal * 0.15);
    if (appliedCoupon === 'BIENVENIDA') return 30;
    return 0;
  }, [appliedCoupon, cartSubtotal]);

  const shippingCost = cartSubtotal >= 150 || cartSubtotal === 0 ? 0 : 25;
  const cartTotal = Math.max(0, cartSubtotal - couponDiscount + shippingCost);
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const targetString = `${product.name} ${product.brand} ${product.modelCode} ${product.categoryName} ${product.tagline} ${product.description} ${product.features.join(' ')}`
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

        if (!targetString.includes(query)) return false;
      }

      if (filters.category !== 'todos' && product.category !== filters.category) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) return false;
      if (product.price < filters.minPrice || product.price > filters.maxPrice) return false;
      if (filters.energyRatings.length > 0 && !filters.energyRatings.includes(product.energyRating)) return false;
      if (filters.onlyInStock && !product.inStock) return false;
      if (filters.onlyFreeShipping && !product.freeShipping) return false;
      if (filters.onlyOffers && (!product.originalPrice || product.originalPrice <= product.price)) return false;
      if (filters.onlyWifi && !product.specs.smartWifi) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'discount') {
        const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
        const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
        return discB - discA;
      }
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [filters]);

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of PRODUCTS) {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    }
    return counts;
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { todos: PRODUCTS.length };
    for (const p of PRODUCTS) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery.trim()) count++;
    if (filters.category !== 'todos') count++;
    if (filters.brands.length > 0) count += filters.brands.length;
    if (filters.minPrice > 0 || filters.maxPrice < 3000) count++;
    if (filters.energyRatings.length > 0) count += filters.energyRatings.length;
    if (filters.onlyInStock) count++;
    if (filters.onlyFreeShipping) count++;
    if (filters.onlyOffers) count++;
    if (filters.onlyWifi) count++;
    return count;
  }, [filters]);

  const comparedProducts = useMemo(() => {
    return PRODUCTS.filter((p) => comparedProductIds.includes(p.id));
  }, [comparedProductIds]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/60 selection:bg-blue-600 selection:text-white">
      {/* 1. Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        compareCount={comparedProductIds.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        onScrollToCatalog={scrollToCatalog}
        onOpenOrdersHistory={() => setIsOrdersModalOpen(true)}
        dbOrdersCount={dbOrdersCount}
      />

      {/* 2. Hero Banner */}
      <HeroBanner
        onSelectCategory={handleSelectCategory}
        onExploreClick={scrollToCatalog}
      />

      {/* 3. Brand Showcase Bar */}
      <BrandShowcase
        selectedBrands={filters.brands}
        onSelectBrand={handleSelectBrandInShowcase}
        brandCounts={brandCounts}
      />

      {/* 4. Main Product Catalog & Filter System */}
      <main ref={catalogRef} className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Neon Database Status Banner */}
        <div className="mb-6 p-3.5 bg-white rounded-xl border border-emerald-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 flex items-center gap-2">
                <span>Base de Datos Neon PostgreSQL Conectada</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </p>
              <p className="text-slate-500 text-[11px]">
                Las compras realizadas con el botón &quot;Comprar Producto&quot; se guardan automáticamente en la tabla <code>orders</code>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsOrdersModalOpen(true)}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ver Compras Guardadas ({dbOrdersCount})</span>
            </button>
          </div>
        </div>

        {/* Search, Sort and Category Quick Tabs */}
        <SearchAndFilterBar
          filters={filters}
          onUpdateFilters={handleUpdateFilters}
          onResetFilters={handleResetFilters}
          totalResults={filteredProducts.length}
          onToggleMobileFilters={() => setIsMobileFiltersOpen(true)}
          activeFilterCount={activeFilterCount}
        />

        {/* Catalog Grid with Desktop Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-start">
          {/* Desktop Left Sidebar: Cart Box Widget + Complete Filters */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-24 space-y-6">
            {/* Casilla del Carrito (Requested by user) */}
            <CartBoxWidget
              items={cart}
              onUpdateQuantity={handleUpdateCartQuantity}
              onRemoveItem={handleRemoveFromCart}
              onClearCart={handleClearCart}
              onBuyProducts={() => setIsCheckoutOpen(true)}
              onOpenOrdersHistory={() => setIsOrdersModalOpen(true)}
            />

            {/* Complete Filter System */}
            <FilterSidebar
              filters={filters}
              onUpdateFilters={handleUpdateFilters}
              onResetFilters={handleResetFilters}
              brandCounts={brandCounts}
              categoryCounts={categoryCounts}
            />
          </aside>

          {/* Right Product Grid Area */}
          <section className="lg:col-span-8 xl:col-span-9 space-y-6">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => setSelectedProduct(p)}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                    onBuyNow={(p) => handleBuyNow(p, 1)}
                    onToggleCompare={handleToggleCompare}
                    isCompared={comparedProductIds.includes(product.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <PackageX className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  No se encontraron electrodomésticos con los filtros seleccionados
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Prueba a ajustar o borrar los filtros de marca, rango de precio o eficiencia energética para ver más opciones disponibles.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Restablecer todos los filtros
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Floating Comparison Bar */}
      {comparedProductIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-4 text-xs animate-slideUp max-w-[90vw]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-400" />
            <span className="font-semibold">
              {comparedProductIds.length} {comparedProductIds.length === 1 ? 'modelo seleccionado' : 'modelos seleccionados'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCompareOpen(true)}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
            >
              Ver Comparativa
            </button>
            <button
              onClick={handleClearCompared}
              className="px-2.5 py-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Limpiar
            </button>
          </div>
        </div>
      )}

      {/* Mobile Filters Modal Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex lg:hidden justify-end">
          <div
            className="bg-white w-full max-w-sm h-full overflow-y-auto p-4 flex flex-col justify-between space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <CartBoxWidget
              items={cart}
              onUpdateQuantity={handleUpdateCartQuantity}
              onRemoveItem={handleRemoveFromCart}
              onClearCart={handleClearCart}
              onBuyProducts={() => {
                setIsMobileFiltersOpen(false);
                setIsCheckoutOpen(true);
              }}
              onOpenOrdersHistory={() => {
                setIsMobileFiltersOpen(false);
                setIsOrdersModalOpen(true);
              }}
            />

            <FilterSidebar
              filters={filters}
              onUpdateFilters={handleUpdateFilters}
              onResetFilters={handleResetFilters}
              brandCounts={brandCounts}
              categoryCounts={categoryCounts}
              onCloseMobile={() => setIsMobileFiltersOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onToggleCompare={handleToggleCompare}
        isCompared={selectedProduct ? comparedProductIds.includes(selectedProduct.id) : false}
      />

      {/* Comparison Matrix Modal */}
      {isCompareOpen && (
        <CompareModal
          products={comparedProducts}
          onClose={() => setIsCompareOpen(false)}
          onRemove={handleRemoveCompared}
          onClearAll={handleClearCompared}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        couponDiscount={couponDiscount}
      />

      {/* Checkout Modal with Neon DB persistence */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        subtotal={cartSubtotal}
        discount={couponDiscount}
        shipping={shippingCost}
        total={cartTotal}
        onSuccess={() => {
          handleClearCart();
          setAppliedCoupon(null);
          refreshDbOrdersCount();
          addToast(
            '¡Compra guardada con éxito!',
            'El registro fue almacenado en la base de datos Neon PostgreSQL',
            'cart'
          );
        }}
        onOpenOrdersHistory={() => setIsOrdersModalOpen(true)}
      />

      {/* Neon DB Saved Orders Modal */}
      <DbOrdersModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
        onOpenStore={() => {
          setIsOrdersModalOpen(false);
          scrollToCatalog();
        }}
      />

      {/* Lightweight Toast Notifications */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />

      {/* Footer */}
      <Footer onScrollToCatalog={scrollToCatalog} />
    </div>
  );
}
