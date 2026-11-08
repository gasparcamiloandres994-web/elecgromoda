import React from 'react';
import { ShoppingBag, SlidersHorizontal, ShieldCheck, Zap, Database } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  compareCount: number;
  onOpenCompare: () => void;
  onScrollToCatalog: () => void;
  onOpenOrdersHistory: () => void;
  dbOrdersCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  compareCount,
  onOpenCompare,
  onScrollToCatalog,
  onOpenOrdersHistory,
  dbOrdersCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top micro promo bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <span className="font-medium text-amber-400">Ofertas de Temporada:</span>
        <span>Hasta 30% OFF en electrodomésticos seleccionados</span>
        <span className="hidden sm:inline">·</span>
        <span className="hidden sm:inline text-emerald-400 flex items-center gap-1">
          <Database className="w-3 h-3" /> Base de Datos Neon PostgreSQL Conectada
        </span>
      </div>

      {/* Main Top Bar adhering to Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Brand Wordmark element */}
          <a
            href="#"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:bg-blue-700 transition-colors">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span>ElectroNova</span>
          </a>

          {/* Zone 2: 4-5 Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={onScrollToCatalog}
              className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Catálogo Completo
            </button>
            <button
              onClick={onScrollToCatalog}
              className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Grandes Marcas
            </button>
            <button
              onClick={onOpenCompare}
              className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <span>Comparador</span>
              {compareCount > 0 && (
                <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-1.5 py-0.2 rounded">
                  {compareCount}
                </span>
              )}
            </button>
            <button
              onClick={onOpenOrdersHistory}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 text-slate-700 font-semibold"
            >
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Compras en BD</span>
              {dbOrdersCount > 0 && (
                <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                  {dbOrdersCount}
                </span>
              )}
            </button>
            <span className="text-slate-500 hover:text-slate-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Garantía Oficial
            </span>
          </nav>

          {/* Zone 3: 1 Primary action / Shopping bag trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenOrdersHistory}
              className="md:hidden flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
              title="Ver compras en base de datos"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>BD</span>
            </button>

            {compareCount > 0 && (
              <button
                onClick={onOpenCompare}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                title="Ver comparador de electrodomésticos"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
                <span>Comparar ({compareCount})</span>
              </button>
            )}

            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-sm active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
              aria-label="Abrir carrito de compras"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Casilla Carrito</span>
              <span className="bg-white text-blue-700 text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center tabular-nums">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
