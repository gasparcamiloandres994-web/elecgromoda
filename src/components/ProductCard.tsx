import React, { useState } from 'react';
import { Product } from '../types';
import { ShoppingBag, Star, Check, SlidersHorizontal, Eye, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  isCompared: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  onBuyNow,
  onToggleCompare,
  isCompared,
}) => {
  const [imageError, setImageError] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuyNow(product);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCompare(product);
  };

  return (
    <article
      onClick={() => onSelect(product)}
      className="group bg-white rounded-xl border border-slate-200/90 overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all duration-200 flex flex-col cursor-pointer relative"
    >
      {/* Top Media Slot */}
      <div className="relative aspect-4/3 w-full bg-slate-50 overflow-hidden flex items-center justify-center p-4">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-gradient-to-br from-slate-100 to-slate-200 p-4 text-center">
            <Zap className="w-10 h-10 mb-2 text-slate-400" />
            <span className="text-xs font-medium text-slate-500">{product.name}</span>
          </div>
        )}

        {/* Energy efficiency tag & discount badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          <span className="text-[11px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded shadow-xs">
            {product.energyRating}
          </span>
          {discountPercent > 0 && (
            <span className="text-[10px] font-bold bg-rose-600 text-white px-1.5 py-0.5 rounded shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Compare quick button on top right */}
        <div className="absolute top-3 right-3">
          <button
            type="button"
            onClick={handleCompareClick}
            className={`p-2 rounded-lg text-xs font-medium transition-all shadow-xs cursor-pointer ${
              isCompared
                ? 'bg-blue-600 text-white'
                : 'bg-white/90 hover:bg-white text-slate-700 backdrop-blur-xs'
            }`}
            title={isCompared ? 'Quitar del comparador' : 'Añadir al comparador'}
            aria-label="Comparar producto"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick View overlay on hover */}
        <div className="absolute inset-x-0 bottom-3 px-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-slate-900/85 text-white text-xs font-medium px-3 py-1.5 rounded-md backdrop-blur-xs flex items-center gap-1.5 shadow-md">
            <Eye className="w-3.5 h-3.5" />
            <span>Vista rápida</span>
          </span>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Brand & Category unboxed metadata with dot separator */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5 font-bold tracking-wider uppercase text-blue-600">
              <span>{product.brand}</span>
              <span className="text-slate-300 font-normal" aria-hidden="true">·</span>
              <span className="text-slate-400 font-normal normal-case">{product.categoryName}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h4 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h4>

          {/* Tagline / Brief Benefit */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Pricing and Action bottom zone */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-bold text-slate-900 tabular-nums">
                  ${product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-slate-400 line-through tabular-nums">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {product.freeShipping ? (
                  <span className="text-emerald-700 font-medium">Envío gratuito</span>
                ) : (
                  'Envío estándar'
                )}
              </p>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {product.modelCode}
            </span>
          </div>

          {/* Dual Action Buttons: "Comprar Producto" and "Agregar a Casilla" */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleAdd}
              className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer border ${
                addedAnimation
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
              }`}
              title="Añadir a la casilla del carrito"
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>En casilla</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-slate-500" />
                  <span>Añadir</span>
                </>
              )}
            </button>

            {/* Direct COMPRAR PRODUCTO button */}
            <button
              type="button"
              onClick={handleBuy}
              className="py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs active:scale-95 cursor-pointer"
              title="Comprar este producto directamente y guardar en la base de datos"
            >
              <Zap className="w-3.5 h-3.5 fill-white text-white" />
              <span>Comprar Producto</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
