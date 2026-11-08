import React from 'react';
import { Zap, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onScrollToCatalog: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToCatalog }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span>ElectroNova</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Especialistas en electrodomésticos de alta gama, eficiencia energética comprobada y tecnología para el hogar moderno.
            </p>
            <div className="pt-2 text-slate-400 space-y-1 text-[11px]">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" /> +34 900 123 456 (Lunes a Sábado 9h-20h)
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" /> atencion@electronova.es
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400" /> Centro Logístico & Showroom Central
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider">Categorías</h4>
            <ul className="space-y-1.5">
              <li><button onClick={onScrollToCatalog} className="hover:text-white transition-colors cursor-pointer">Frigoríficos & Congeladores</button></li>
              <li><button onClick={onScrollToCatalog} className="hover:text-white transition-colors cursor-pointer">Lavadoras & Secadoras de Carga Frontal</button></li>
              <li><button onClick={onScrollToCatalog} className="hover:text-white transition-colors cursor-pointer">Hornos Pirolíticos & Placas de Inducción</button></li>
              <li><button onClick={onScrollToCatalog} className="hover:text-white transition-colors cursor-pointer">Cafeteras Espresso & Freidoras de Aire</button></li>
              <li><button onClick={onScrollToCatalog} className="hover:text-white transition-colors cursor-pointer">Aspiradoras Láser & Climatización Split</button></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider">Atención y Garantías</h4>
            <ul className="space-y-1.5">
              <li className="hover:text-white transition-colors">Seguimiento de Envío</li>
              <li className="hover:text-white transition-colors">Garantía Oficial del Fabricante</li>
              <li className="hover:text-white transition-colors">Instalación y Retirada RAEE</li>
              <li className="hover:text-white transition-colors">30 Días de Prueba y Devolución</li>
              <li className="hover:text-white transition-colors">Financiación hasta 12 Cuotas</li>
            </ul>
          </div>

          {/* Trust and Eco */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider">Compromiso Energético</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Todos nuestros productos cumplen con el nuevo etiquetado energético de la Unión Europea para optimizar el consumo eléctrico y de agua en tu hogar.
            </p>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-white text-[11px]">Compra 100% Asegurada</p>
                <p className="text-[10px] text-slate-400">Protección al consumidor y pago encriptado</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© 2026 ElectroNova Technologies S.L. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-200">Aviso Legal</span>
            <span className="hover:text-slate-200">Privacidad & Cookies</span>
            <span className="hover:text-slate-200">Condiciones de Venta</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
