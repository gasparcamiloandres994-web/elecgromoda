import React, { useEffect, useState } from 'react';
import { DbOrder } from '../types';
import { X, Database, RefreshCw, CheckCircle2, Calendar, ShoppingBag, Trash2 } from 'lucide-react';

interface DbOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenStore: () => void;
}

export const DbOrdersModal: React.FC<DbOrdersModalProps> = ({
  isOpen,
  onClose,
  onOpenStore,
}) => {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.error || 'Error al obtener las compras');
      }
    } catch (err: any) {
      setError(err.message || 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Deseas eliminar este registro de prueba de la base de datos Neon?')) return;
    try {
      await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                Compras Guardadas en Base de Datos
              </h2>
              <p className="text-xs text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Neon PostgreSQL (Tabla: <code>orders</code>)</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Actualizar registros desde Neon DB"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading && orders.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-600">Consultando base de datos Neon PostgreSQL...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              <p className="font-bold">Error de conexión:</p>
              <p>{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Aún no hay compras guardadas en la base de datos</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Agrega productos al carrito y haz clic en &quot;Comprar Producto&quot; para registrar tu primera compra en Neon.
              </p>
              <button
                onClick={onOpenStore}
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Comprar un Electrodoméstico Ahora
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 flex justify-between items-center pb-2 border-b border-slate-100">
                <span>Mostrando {orders.length} pedidos guardados en la tabla <code>orders</code></span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Conexión Activa y Persistente
                </span>
              </div>

              {orders.map((order) => {
                const parsedItems = Array.isArray(order.items)
                  ? order.items
                  : typeof order.items === 'string'
                  ? JSON.parse(order.items)
                  : [];

                const formattedDate = new Date(order.created_at).toLocaleString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={order.id}
                    className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4 hover:border-blue-300 transition-colors"
                  >
                    {/* Order Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">
                            Orden #{order.order_number}
                          </span>
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{formattedDate}</span>
                          <span>·</span>
                          <span>ID en BD: #{order.id}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block uppercase font-medium">Total Facturado</span>
                          <span className="text-base font-extrabold text-blue-600 tabular-nums">
                            ${Number(order.total).toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="text-slate-300 hover:text-rose-600 p-1.5 cursor-pointer rounded"
                          title="Eliminar registro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 font-semibold block">Cliente</span>
                        <span className="font-semibold text-slate-800">{order.customer_name}</span>
                        <span className="text-[11px] text-slate-500 block truncate">{order.customer_email}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 font-semibold block">Entrega</span>
                        <span className="text-slate-700 block truncate">{order.shipping_address}</span>
                        <span className="text-slate-500 text-[11px]">{order.city || 'Envío Express'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 font-semibold block">Pago</span>
                        <span className="text-slate-700 block font-medium">{order.payment_method}</span>
                      </div>
                    </div>

                    {/* Items Purchased */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                        Electrodomésticos Comprados ({parsedItems.length})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {parsedItems.map((item: any, idx: number) => {
                          const prod = item.product || item;
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50/70 border border-slate-100"
                            >
                              <div className="w-10 h-10 bg-white rounded p-1 shrink-0 border border-slate-200/60 flex items-center justify-center">
                                {prod.image && (
                                  <img
                                    src={prod.image}
                                    alt={prod.name}
                                    referrerPolicy="no-referrer"
                                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0 text-xs">
                                <span className="text-[10px] font-bold uppercase text-blue-600 block truncate">
                                  {prod.brand}
                                </span>
                                <h5 className="font-semibold text-slate-800 truncate">
                                  {item.quantity}x {prod.name}
                                </h5>
                                <span className="text-slate-500 text-[11px] tabular-nums font-semibold">
                                  ${Number(prod.price * (item.quantity || 1)).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
