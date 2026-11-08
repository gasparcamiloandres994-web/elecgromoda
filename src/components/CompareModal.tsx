import React from 'react';
import { Product } from '../types';
import { X, Trash2, ShoppingBag, Star, Check } from 'lucide-react';

interface CompareModalProps {
  products: Product[];
  onClose: () => void;
  onRemove: (productId: string) => void;
  onClearAll: () => void;
  onAddToCart: (product: Product) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  products,
  onClose,
  onRemove,
  onClearAll,
  onAddToCart,
}) => {
  if (products.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Comparador de Electrodomésticos</h3>
          <p className="text-xs text-slate-500">
            No tienes modelos seleccionados para comparar. Haz clic en el botón de comparar en las tarjetas de producto (máximo 4 electrodomésticos).
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-lg cursor-pointer hover:bg-blue-500"
          >
            Volver al Catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Comparador Técnico de Modelos ({products.length}/4)
            </h2>
            <p className="text-xs text-slate-500">
              Analiza especificaciones, medidas y eficiencia lado a lado para tomar la mejor decisión
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClearAll}
              className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar todo</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto p-6">
          <table className="w-full text-xs text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-3 w-40 text-slate-400 font-semibold uppercase text-[11px] bg-slate-50/50">
                  Electrodoméstico
                </th>
                {products.map((p) => (
                  <th key={p.id} className="p-3 align-top min-w-[200px]">
                    <div className="relative space-y-2">
                      <button
                        onClick={() => onRemove(p.id)}
                        className="absolute -top-1 -right-1 p-1 text-slate-400 hover:text-rose-600 rounded-full hover:bg-rose-50 cursor-pointer"
                        title="Quitar de comparación"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="w-24 h-24 mx-auto bg-slate-50 rounded-lg p-2 flex items-center justify-center">
                        <img
                          src={p.image}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <div className="text-center space-y-1">
                        <span className="text-[10px] uppercase font-bold text-blue-600 block">{p.brand}</span>
                        <h4 className="font-semibold text-slate-900 text-xs line-clamp-2">{p.name}</h4>
                        <div className="text-sm font-extrabold text-slate-900 tabular-nums">
                          ${p.price.toLocaleString()}
                        </div>
                        <button
                          onClick={() => onAddToCart(p)}
                          className="w-full mt-2 py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold rounded-md flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Comprar</span>
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Category */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Categoría</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-slate-800">{p.categoryName}</td>
                ))}
              </tr>

              {/* Energy Rating */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Eficiencia Energética</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 font-bold text-emerald-700">
                    <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Clase {p.energyRating}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Dimensions */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Dimensiones</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-slate-700">{p.specs.dimensiones}</td>
                ))}
              </tr>

              {/* Capacity */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Capacidad</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-slate-700">{p.specs.capacidad || 'N/A'}</td>
                ))}
              </tr>

              {/* Power */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Potencia</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-slate-700">{p.specs.potencia || 'N/A'}</td>
                ))}
              </tr>

              {/* Noise Level */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Nivel de Ruido</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-slate-700">{p.specs.nivelRuido || 'Estándar'}</td>
                ))}
              </tr>

              {/* Color */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Color / Acabado</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-slate-700">{p.specs.color}</td>
                ))}
              </tr>

              {/* Wi-Fi Smart */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Smart Wi-Fi</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-slate-700 font-medium">
                    {p.specs.smartWifi ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Conectividad App
                      </span>
                    ) : (
                      <span className="text-slate-400">Sin Wi-Fi</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Warranty */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Garantía</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-slate-700 font-medium">{p.specs.garantia}</td>
                ))}
              </tr>

              {/* Rating */}
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Opinión Usuarios</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 text-slate-700">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold">{p.rating}</span>
                      <span className="text-slate-400">({p.reviewCount})</span>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
