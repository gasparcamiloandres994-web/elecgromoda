import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { CategoryId, FilterState } from '../types';
import { CATEGORIES } from '../data/products';

interface SearchAndFilterBarProps {
  filters: FilterState;
  onUpdateFilters: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalResults: number;
  onToggleMobileFilters: () => void;
  activeFilterCount: number;
}

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters,
  totalResults,
  onToggleMobileFilters,
  activeFilterCount,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Search Input & Controls Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input Box */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
              placeholder="Buscar por marca, electrodoméstico, modelo o tecnología (ej. Samsung, Inverter, Airfryer)..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            />
            {filters.searchQuery && (
              <button
                onClick={() => onUpdateFilters({ searchQuery: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Action Controls: Sort + Mobile Filter Trigger */}
          <div className="flex items-center gap-2.5">
            {/* Sort Select */}
            <div className="relative flex items-center">
              <label htmlFor="sort-select" className="sr-only">Ordenar productos</label>
              <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <select
                id="sort-select"
                value={filters.sortBy}
                onChange={(e) => onUpdateFilters({ sortBy: e.target.value as FilterState['sortBy'] })}
                className="pl-9 pr-8 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 appearance-none transition-colors"
              >
                <option value="featured">Destacados</option>
                <option value="price-asc">Menor precio</option>
                <option value="price-desc">Mayor precio</option>
                <option value="rating">Mejor valorados</option>
                <option value="discount">Mayor descuento</option>
              </select>
            </div>

            {/* Mobile Filters Drawer Trigger */}
            <button
              onClick={onToggleMobileFilters}
              className="lg:hidden flex items-center gap-2 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtros</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Segmented Navigation Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onUpdateFilters({ category: cat.id as CategoryId })}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100/70 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header and Active Filters Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 px-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 tabular-nums">{totalResults}</span>
          <span>{totalResults === 1 ? 'electrodoméstico encontrado' : 'electrodomésticos encontrados'}</span>
          {filters.searchQuery && (
            <>
              <span aria-hidden="true">·</span>
              <span>para &ldquo;<strong className="text-slate-700">{filters.searchQuery}</strong>&rdquo;</span>
            </>
          )}
        </div>

        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {filters.category !== 'todos' && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                Categoría: {CATEGORIES.find((c) => c.id === filters.category)?.name}
                <button
                  onClick={() => onUpdateFilters({ category: 'todos' })}
                  className="hover:text-blue-900 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.brands.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium"
              >
                Marca: {b}
                <button
                  onClick={() =>
                    onUpdateFilters({
                      brands: filters.brands.filter((brand) => brand !== b),
                    })
                  }
                  className="hover:text-slate-900 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {filters.energyRatings.map((rating) => (
              <span
                key={rating}
                className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-xs font-medium"
              >
                Clase {rating}
                <button
                  onClick={() =>
                    onUpdateFilters({
                      energyRatings: filters.energyRatings.filter((r) => r !== rating),
                    })
                  }
                  className="hover:text-emerald-950 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {(filters.minPrice > 0 || filters.maxPrice < 3000) && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium">
                Precio: ${filters.minPrice} - ${filters.maxPrice}
                <button
                  onClick={() => onUpdateFilters({ minPrice: 0, maxPrice: 3000 })}
                  className="hover:text-slate-900 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.onlyInStock && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium">
                En stock
                <button
                  onClick={() => onUpdateFilters({ onlyInStock: false })}
                  className="hover:text-slate-900 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.onlyOffers && (
              <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-xs font-medium">
                En oferta
                <button
                  onClick={() => onUpdateFilters({ onlyOffers: false })}
                  className="hover:text-rose-900 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={onResetFilters}
              className="text-xs text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer ml-1"
            >
              Limpiar todos los filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
