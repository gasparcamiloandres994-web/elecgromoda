import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, ArrowRight, ShieldCheck, Truck, Tag, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => boolean;
  couponDiscount: number;
}

const FREE_SHIPPING_THRESHOLD = 150;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
  couponDiscount,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shippingCost = isFreeShipping ? 0 : 25;
  const missingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const finalTotal = Math.max(0, subtotal - couponDiscount + shippingCost);

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = onApplyCoupon(couponInput.trim());
    if (ok) {
      setCouponMessage({ text: '¡Cupón aplicado con éxito!', success: true });
      setCouponInput('');
    } else {
      setCouponMessage({ text: 'Cupón inválido. Prueba con ELECTRO10 o BIENVENIDA', success: false });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div
        className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col relative animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-base">Carrito de Compras</h2>
            <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full tabular-nums">
              {items.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress bar */}
        <div className="px-5 py-3 bg-blue-50/70 border-b border-blue-100 text-xs">
          {isFreeShipping ? (
            <div className="flex items-center gap-2 text-emerald-700 font-semibold">
              <Truck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>¡Felicidades! Tienes envío gratuito en tu pedido</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Te faltan <strong>${missingForFreeShipping.toLocaleString()}</strong> para envío gratis</span>
                </span>
                <span className="font-bold text-blue-600">{freeShippingPercent}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${freeShippingPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Items List or Empty state */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">Tu carrito está vacío</h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Añade los electrodomésticos que necesites para tu hogar y aprovecha nuestras ofertas y financiación.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-lg hover:bg-blue-500 transition-colors cursor-pointer"
              >
                Explorar productos
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3.5 p-3 rounded-xl border border-slate-100 bg-white hover:border-slate-200 transition-colors"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 bg-slate-50 rounded-lg p-1.5 shrink-0 flex items-center justify-center border border-slate-100">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">
                      {item.product.brand}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] font-bold text-slate-900 tabular-nums">
                      ${item.product.price.toLocaleString()} c/u
                    </p>
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-slate-200 rounded-md bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-slate-500 hover:bg-slate-100 cursor-pointer font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-bold tabular-nums">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-slate-500 hover:bg-slate-100 cursor-pointer font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-slate-900 tabular-nums">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        title="Eliminar del carrito"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50/70 space-y-4">
            {/* Coupon form */}
            <form onSubmit={handleCouponSubmit} className="space-y-1.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Código promocional (ej. ELECTRO10)"
                    className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs uppercase text-slate-800 placeholder:normal-case placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium cursor-pointer"
                >
                  Aplicar
                </button>
              </div>
              {couponMessage && (
                <p className={`text-[11px] ${couponMessage.success ? 'text-emerald-700 font-semibold' : 'text-rose-600'}`}>
                  {couponMessage.text}
                </p>
              )}
              {appliedCoupon && (
                <p className="text-[11px] text-emerald-700 font-medium">
                  Cupón activo: <strong>{appliedCoupon}</strong> (-${couponDiscount.toLocaleString()})
                </p>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200/60 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 tabular-nums">${subtotal.toLocaleString()}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Descuento cupón</span>
                  <span className="tabular-nums">-${couponDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Envío asegurado</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {isFreeShipping ? <span className="text-emerald-700">Gratis</span> : `$${shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200/80 pt-2">
                <span>Total Estimado</span>
                <span className="tabular-nums text-base text-blue-600">${finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={onProceedToCheckout}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <span>Continuar Compra</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 text-center">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Compra 100% Protegida
              </span>
              <span>·</span>
              <span>Garantía Oficial Directa</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
