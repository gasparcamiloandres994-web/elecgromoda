import React from 'react';
import { ShieldCheck, Truck, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import { CategoryId } from '../types';

interface HeroBannerProps {
  onSelectCategory: (cat: CategoryId) => void;
  onExploreClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectCategory,
  onExploreClick,
}) => {
  return (
    <section className="relative bg-slate-950 text-white overflow-hidden border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline and Call-to-actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-400">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Colección Electrodomésticos 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
              Tecnología de precisión para equipar tu hogar
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Explora nuestra cuidada selección de frigoríficos, lavadoras, hornos pirolíticos y pequeños electrodomésticos con máxima eficiencia energética y garantía oficial directa.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 active:scale-95 cursor-pointer"
              >
                <span>Explorar Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-400 pl-2">
                <span>+16 modelos en stock</span>
                <span aria-hidden="true">·</span>
                <span>Marcas líderes mundiales</span>
              </div>
            </div>

            {/* Quick category pills for fast filtering */}
            <div className="pt-4 border-t border-slate-800/80">
              <div className="text-xs text-slate-400 mb-2 font-medium">Accesos rápidos por categoría:</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onSelectCategory('refrigeracion')}
                  className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
                >
                  Frigoríficos & Cavas
                </button>
                <button
                  onClick={() => onSelectCategory('lavado')}
                  className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
                >
                  Lavadoras & Secado
                </button>
                <button
                  onClick={() => onSelectCategory('cocina')}
                  className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
                >
                  Hornos & Inducción
                </button>
                <button
                  onClick={() => onSelectCategory('pequenos')}
                  className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
                >
                  Cafeteras & Freidoras
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Hero High-Res Generated Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 bg-slate-900 aspect-16/9 lg:aspect-4/3 group">
              <img
                src="/src/assets/images/hero_kitchen_appliances_1793043383248.jpg"
                alt="Cocina moderna equipada con electrodomésticos de acero inoxidable integrados"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-xs flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Equipamiento integral</p>
                  <p className="text-slate-400 text-[11px]">Diseño europeo y conectividad inteligente</p>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                  Clase A+++
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Value Pillars strip directly adjacent */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-800 text-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-blue-400 shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">Envío Especializado</p>
              <p className="text-slate-400 text-[11px]">Despacho con desembalaje y retiro</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-blue-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">Garantía Directa</p>
              <p className="text-slate-400 text-[11px]">De 2 a 10 años en compresores</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-blue-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">Marcas Certificadas</p>
              <p className="text-slate-400 text-[11px]">Bosch, Samsung, LG, Philips y más</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-blue-400 shrink-0">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">30 Días de Prueba</p>
              <p className="text-slate-400 text-[11px]">Cambio inmediato sin complicaciones</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
