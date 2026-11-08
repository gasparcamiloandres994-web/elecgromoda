import React from 'react';
import { BRANDS } from '../data/products';

interface BrandShowcaseProps {
  selectedBrands: string[];
  onSelectBrand: (brand: string) => void;
  brandCounts: Record<string, number>;
}

export const BrandShowcase: React.FC<BrandShowcaseProps> = ({
  selectedBrands,
  onSelectBrand,
  brandCounts,
}) => {
  return (
    <section className="bg-white border-y border-slate-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Nuestras Marcas de Confianza
            </h2>
            <p className="text-xs text-slate-500">
              Fabricantes líderes con garantía oficial y servicio técnico autorizado
            </p>
          </div>
          <span className="text-xs text-slate-400">
            Haz clic en una marca para filtrar al instante
          </span>
        </div>

        {/* Brand Grid Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
          {BRANDS.map((brand) => {
            const isSelected = selectedBrands.includes(brand);
            const count = brandCounts[brand] || 0;
            return (
              <button
                key={brand}
                onClick={() => onSelectBrand(brand)}
                className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <span className="font-bold text-xs tracking-wide">{brand}</span>
                <span className="text-[10px] text-slate-400 tabular-nums">
                  {count} {count === 1 ? 'modelo' : 'modelos'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
