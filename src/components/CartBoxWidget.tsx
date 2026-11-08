import React, { useState } from 'react';
import { CartItem } from '../types';
import { ShoppingBag, Trash2, Database, ArrowRight, ShieldCheck, Check, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface CartBoxWidgetProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onBuyProducts: () => void;
  onOpenOrdersHistory: () => void;
}

export const CartBoxWidget: React.FC<CartBoxWidgetProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onBuyProducts,
  onOpenOrdersHistory,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="bg-white rounded-2xl border-2 border-blue-600/30 shadow-xl overflow-hidden transition-all duration-300">
      {/* Box Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm tracking-tight">Casilla del Carrito</h3>
              <span className="bg-blue-500/30 text-blue-200 text-[11px] font-bold px-2 py-0.5 rounded-full border border-blue-400/30">
                {totalItemsCount} {totalItemsCount === 1 ? 'producto' : 'productos'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-blue-300">
              <Database className="w-3 h-3 text-emerald-400" />
              <span>Conectado a Neon PostgreSQL</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onOpenOrdersHistory}
            className="text-[11px] text-blue-200 hover:text-white underline px-2 py-1 cursor-pointer font-medium"
            title="Ver compras registradas en la base de datos"
          >
            Ver BD
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label={isCollapsed ? 'Expandir casilla de carrito' : 'Colapsar casilla de carrito'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Box Body */}
      {!isCollapsed && (
        <div className="p-4 space-y-4">
          {items.length === 0 ? (
            <div className="py-6 text-center space-y-2">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-700">La casilla del carrito está vacía</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Selecciona cualquier electrodoméstico del catálogo y haz clic en &quot;Agregar a la casilla&quot; o &quot;Comprar Producto&quot;.
              </p>
            </div>
          ) : (
            <>
              {/* Product List in Cart Box */}
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100">
                {items.map((item) => (
                  <div key={item.product.id} className="pt-2 first:pt-0 flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-50 rounded-lg p-1 shrink-0 flex items-center justify-center border border-slate-100">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-blue-600 truncate">
                          {item.product.brand}
                        </span>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-800 truncate">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-bold text-slate-900 tabular-nums">
                          ${(item.product.price * item.quantity).toLocaleString()}
                        </span>

                        {/* Mini quantity control */}
                        <div className="flex items-center border border-slate-200 rounded bg-slate-50 text-[11px]">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="px-1.5 text-slate-500 hover:text-slate-900 font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-1.5 font-bold tabular-nums text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="px-1.5 text-slate-500 hover:text-slate-900 font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotal & Actions */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Total en casilla:</span>
                  <span className="text-base font-extrabold text-slate-900 tabular-nums">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>

                {/* Primary Action Button: COMPRAR PRODUCTO */}
                <button
                  type="button"
                  onClick={onBuyProducts}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Comprar Producto / Guardar en BD</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                  <span className="flex items-center gap-1 text-emerald-700">
                    <Check className="w-3.5 h-3.5" />
                    Guarda pedido en Neon
                  </span>
                  <button
                    onClick={onClearCart}
                    className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    Vaciar casilla
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
