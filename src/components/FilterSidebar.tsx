import React from 'react';
import { FilterState, EnergyRating, CategoryId } from '../types';
import { CATEGORIES, BRANDS } from '../data/products';
import { RotateCcw, Check, Sparkles, Wifi } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  onUpdateFilters: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  brandCounts: Record<string, number>;
  categoryCounts: Record<string, number>;
  onCloseMobile?: () => void;
}

const ENERGY_RATINGS: EnergyRating[] = ['A+++', 'A++', 'A+', 'A', 'B'];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters,
  brandCounts,
  categoryCounts,
  onCloseMobile,
}) => {
  const toggleBrand = (brand: string) => {
    const isSelected = filters.brands.includes(brand);
    const updated = isSelected
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onUpdateFilters({ brands: updated });
  };

  const toggleEnergyRating = (rating: EnergyRating) => {
    const isSelected = filters.energyRatings.includes(rating);
    const updated = isSelected
      ? filters.energyRatings.filter((r) => r !== rating)
      : [...filters.energyRatings, rating];
    onUpdateFilters({ energyRatings: updated });
  };

  const applyPricePreset = (min: number, max: number) => {
    onUpdateFilters({ minPrice: min, maxPrice: max });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <span>Filtros de Búsqueda</span>
        </h3>
        <button
          onClick={onResetFilters}
          className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer"
          title="Restablecer todos los filtros"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer</span>
        </button>
      </div>

      {/* 1. Categorías */}
      <div className="space-y-2.5">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-700">Categoría</div>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.id;
            const count = categoryCounts[cat.id] ?? 0;
            return (
              <button
                key={cat.id}
                onClick={() => onUpdateFilters({ category: cat.id as CategoryId })}
                className={`w-full flex items-center justify-between py-1.5 px-2 rounded-md text-xs transition-colors cursor-pointer text-left ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[11px] text-slate-400 tabular-nums">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Marcas de Fabricantes */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700">Marca</div>
          {filters.brands.length > 0 && (
            <button
              onClick={() => onUpdateFilters({ brands: [] })}
              className="text-[11px] text-blue-600 hover:underline cursor-pointer"
            >
              Borrar marcas
            </button>
          )}
        </div>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {BRANDS.map((brand) => {
            const isChecked = filters.brands.includes(brand);
            const count = brandCounts[brand] || 0;
            return (
              <label
                key={brand}
                className="flex items-center justify-between py-1 px-1 rounded hover:bg-slate-50 cursor-pointer text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleBrand(brand)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className={`group-hover:text-slate-900 ${isChecked ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                    {brand}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 tabular-nums">({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Rango de Precio */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-700">Rango de Precio</div>
        
        {/* Min / Max inputs */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-medium">Mínimo ($)</span>
            <input
              type="number"
              min={0}
              max={3000}
              step={50}
              value={filters.minPrice}
              onChange={(e) => onUpdateFilters({ minPrice: Number(e.target.value) || 0 })}
              className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs tabular-nums text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-medium">Máximo ($)</span>
            <input
              type="number"
              min={0}
              max={3000}
              step={50}
              value={filters.maxPrice}
              onChange={(e) => onUpdateFilters({ maxPrice: Number(e.target.value) || 3000 })}
              className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs tabular-nums text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Quick Range Presets */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            onClick={() => applyPricePreset(0, 250)}
            className="py-1 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded text-[11px] text-slate-600 font-medium cursor-pointer text-center transition-colors"
          >
            Hasta $250
          </button>
          <button
            onClick={() => applyPricePreset(250, 700)}
            className="py-1 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded text-[11px] text-slate-600 font-medium cursor-pointer text-center transition-colors"
          >
            $250 - $700
          </button>
          <button
            onClick={() => applyPricePreset(700, 1200)}
            className="py-1 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded text-[11px] text-slate-600 font-medium cursor-pointer text-center transition-colors"
          >
            $700 - $1200
          </button>
          <button
            onClick={() => applyPricePreset(1200, 3000)}
            className="py-1 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded text-[11px] text-slate-600 font-medium cursor-pointer text-center transition-colors"
          >
            Más de $1200
          </button>
        </div>
      </div>

      {/* 4. Eficiencia Energética (Crucial para electrodomésticos) */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700">Eficiencia Energética</div>
          {filters.energyRatings.length > 0 && (
            <button
              onClick={() => onUpdateFilters({ energyRatings: [] })}
              className="text-[11px] text-blue-600 hover:underline cursor-pointer"
            >
              Borrar
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ENERGY_RATINGS.map((rating) => {
            const isSelected = filters.energyRatings.includes(rating);
            return (
              <button
                key={rating}
                onClick={() => toggleEnergyRating(rating)}
                className={`px-2.5 py-1 text-xs font-bold rounded border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50/50 hover:bg-emerald-100 border-emerald-200 text-emerald-800'
                }`}
              >
                Clase {rating}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Ventajas y Disponibilidad */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-700">Disponibilidad & Servicios</div>
        
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={filters.onlyInStock}
              onChange={(e) => onUpdateFilters({ onlyInStock: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-slate-700">En stock para envío inmediato</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={filters.onlyFreeShipping}
              onChange={(e) => onUpdateFilters({ onlyFreeShipping: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-slate-700">Solo con envío gratis</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={filters.onlyOffers}
              onChange={(e) => onUpdateFilters({ onlyOffers: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
            />
            <span className="text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              Ofertas y descuentos
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={filters.onlyWifi}
              onChange={(e) => onUpdateFilters({ onlyWifi: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-slate-700 flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-blue-500" />
              Conectividad Smart Wi-Fi
            </span>
          </label>
        </div>
      </div>

      {onCloseMobile && (
        <div className="pt-4 border-t border-slate-100 lg:hidden">
          <button
            onClick={onCloseMobile}
            className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg text-xs cursor-pointer"
          >
            Ver Resultados
          </button>
        </div>
      )}
    </div>
  );
};
