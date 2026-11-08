import React, { useState } from 'react';
import { Product } from '../types';
import { X, Star, ShoppingBag, SlidersHorizontal, ShieldCheck, Truck, RotateCcw, Check, Zap, Wifi } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onToggleCompare: (product: Product) => void;
  isCompared: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onToggleCompare,
  isCompared,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'shipping'>('specs');
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const installmentAmount = (product.price / 12).toFixed(2);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header with Close Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-blue-600">{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span>Modelo: <strong className="text-slate-700 font-mono">{product.modelCode}</strong></span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Cerrar detalles"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Column: Product Image & Badges */}
            <div className="md:col-span-6 space-y-4">
              <div className="aspect-4/3 w-full bg-slate-50 rounded-xl border border-slate-100 p-6 flex items-center justify-center relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain mix-blend-multiply"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  <span className="text-xs font-bold bg-emerald-700 text-white px-2.5 py-0.5 rounded shadow-xs">
                    Clase {product.energyRating}
                  </span>
                  {discountPercent > 0 && (
                    <span className="text-xs font-bold bg-rose-600 text-white px-2 py-0.5 rounded shadow-xs">
                      Ahorras {discountPercent}%
                    </span>
                  )}
                </div>
              </div>

              {/* Quick specs highlights pill row */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Garantía</span>
                  <span className="font-bold text-slate-800 text-[11px] truncate block">{product.specs.garantia}</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Eficiencia</span>
                  <span className="font-bold text-emerald-700 text-xs block">{product.energyRating}</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Smart Wi-Fi</span>
                  <span className="font-bold text-slate-800 text-xs block">
                    {product.specs.smartWifi ? 'Compatible' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing & Purchase Contiguous Module */}
            <div className="md:col-span-6 space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {product.name}
                </h2>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-slate-300" aria-hidden="true">·</span>
                  <span className="text-slate-500">{product.reviewCount} valoraciones de compradores</span>
                </div>
              </div>

              {/* Price block */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                    ${product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through tabular-nums">
                      ${product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-blue-700 font-medium">
                  Hasta 12 cuotas sin interés de <strong>${installmentAmount}</strong>
                </p>
                <p className="text-[11px] text-slate-500">
                  Precio final con IVA incluido. Factura oficial tipo A o B.
                </p>
              </div>

              {/* Stock status */}
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="font-semibold text-slate-800">
                  {product.inStock ? 'Disponible para despacho inmediato' : 'Bajo pedido'}
                </span>
                <span className="text-slate-400">({product.stockCount} unidades disponibles)</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shrink-0">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-100 text-sm font-semibold cursor-pointer"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3 py-2 text-xs font-bold tabular-nums min-w-[32px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-100 text-sm font-semibold cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Box CTA */}
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs border cursor-pointer ${
                      added
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>¡Agregado a la casilla!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-slate-500" />
                        <span>Añadir a casilla</span>
                      </>
                    )}
                  </button>

                  {/* Direct Buy Product CTA */}
                  <button
                    onClick={() => onBuyNow(product, quantity)}
                    className="flex-1 py-3 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md active:scale-98 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-white text-white" />
                    <span>Comprar Producto (${(product.price * quantity).toLocaleString()})</span>
                  </button>
                </div>

                {/* Compare CTA */}
                <button
                  onClick={() => onToggleCompare(product)}
                  className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-colors cursor-pointer ${
                    isCompared
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>{isCompared ? 'Quitar del comparador técnico' : 'Añadir al comparador técnico'}</span>
                </button>
              </div>

              {/* Trust markers */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Garantía oficial {product.specs.garantia}
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  {product.freeShipping ? 'Envío asegurado gratis' : 'Envío asegurado'}
                </span>
                <span className="flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  30 días de cambio
                </span>
              </div>
            </div>
          </div>

          {/* Description Prose */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Descripción del Producto</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Tabbed Technical Details: Specs, Features & Delivery */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200">
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2.5 text-xs font-semibold transition-colors cursor-pointer border-b-2 -mb-px ${
                  activeTab === 'specs'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Ficha Técnica Completa
              </button>
              <button
                onClick={() => setActiveTab('features')}
                className={`pb-2.5 text-xs font-semibold transition-colors cursor-pointer border-b-2 -mb-px ${
                  activeTab === 'features'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Funciones Destacadas ({product.features.length})
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-2.5 text-xs font-semibold transition-colors cursor-pointer border-b-2 -mb-px ${
                  activeTab === 'shipping'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Envío, Instalación & Devoluciones
              </button>
            </div>

            {/* Tab: Specs Table */}
            {activeTab === 'specs' && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                <table className="w-full text-xs">
                  <tbody className="divide-y divide-slate-200/60">
                    <tr>
                      <td className="py-2.5 font-medium text-slate-500 w-1/3">Marca y Fabricante</td>
                      <td className="py-2.5 font-semibold text-slate-900">{product.brand}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium text-slate-500">Código de Modelo</td>
                      <td className="py-2.5 font-mono font-semibold text-slate-900">{product.modelCode}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium text-slate-500">Dimensiones (Alto x Ancho x Prof)</td>
                      <td className="py-2.5 font-semibold text-slate-900">{product.specs.dimensiones}</td>
                    </tr>
                    {product.specs.capacidad && (
                      <tr>
                        <td className="py-2.5 font-medium text-slate-500">Capacidad / Volumen</td>
                        <td className="py-2.5 font-semibold text-slate-900">{product.specs.capacidad}</td>
                      </tr>
                    )}
                    {product.specs.potencia && (
                      <tr>
                        <td className="py-2.5 font-medium text-slate-500">Potencia del Motor / Calentador</td>
                        <td className="py-2.5 font-semibold text-slate-900">{product.specs.potencia}</td>
                      </tr>
                    )}
                    {product.specs.nivelRuido && (
                      <tr>
                        <td className="py-2.5 font-medium text-slate-500">Nivel de Ruido Operativo</td>
                        <td className="py-2.5 font-semibold text-slate-900">{product.specs.nivelRuido}</td>
                      </tr>
                    )}
                    {product.specs.consumo && (
                      <tr>
                        <td className="py-2.5 font-medium text-slate-500">Consumo Energético Estimado</td>
                        <td className="py-2.5 font-semibold text-slate-900">{product.specs.consumo}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="py-2.5 font-medium text-slate-500">Color y Acabado Exterior</td>
                      <td className="py-2.5 font-semibold text-slate-900">{product.specs.color}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium text-slate-500">Garantía del Fabricante</td>
                      <td className="py-2.5 font-semibold text-slate-900">{product.specs.garantia}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium text-slate-500">Conectividad Smart Wi-Fi</td>
                      <td className="py-2.5 font-semibold text-slate-900">
                        {product.specs.smartWifi ? 'Sí, compatible con App y asistentes de voz' : 'No'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab: Features */}
            {activeTab === 'features' && (
              <ul className="space-y-2.5">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Tab: Shipping & Returns */}
            {activeTab === 'shipping' && (
              <div className="space-y-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p>
                  <strong>Entrega a Domicilio:</strong> Todos los grandes electrodomésticos (frigoríficos, lavadoras y hornos) se entregan con equipo especializado de 2 personas, desembalaje e inspección in situ en el lugar deseado de tu cocina o lavadero.
                </p>
                <p>
                  <strong>Retirada del Aparato Antiguo:</strong> Gratuito según la normativa RAEE para reciclaje ecológico y responsable.
                </p>
                <p>
                  <strong>Devolución sin Coste:</strong> Tienes 30 días para probar tu electrodoméstico. Si no estás satisfecho, lo recogemos sin coste adicional en su embalaje original.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
