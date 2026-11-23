import React from 'react';
import { Link, useSearchParams } from 'react-router';

// ---------------------------------------------------------------------------
// Página: Portada institucional y bienvenida para el usuario final.
// No realiza descargas anticipadas del catálogo; presenta los servicios
// de la agencia de viajes y guía al usuario hacia el catálogo de destinos.
// ---------------------------------------------------------------------------
export default function Inicio() {
  const [searchParams] = useSearchParams();
  const modoDebug = searchParams.get('debug') === 'true';
  const rutaDestinos = modoDebug ? '/destinos?debug=true' : '/destinos';

  return (
    <section className="flex flex-col gap-6">
      {/* Hero Banner con gradiente profundo y llamada a la acción */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white p-8 sm:p-10 rounded-2xl shadow-lg border border-blue-800/40">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            Planificador de Viajes Internacionales
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white m-0 mb-4 leading-tight">
            Descubre tu próximo destino con vuelos y hoteles a medida
          </h2>
          <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed m-0 mb-6">
            Explora nuestro catálogo mundial de destinos turísticos, conoce sus
            actividades más emblemáticas y consulta la disponibilidad de vuelos
            y alojamientos para armar tu itinerario ideal.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to={rutaDestinos}
              className="inline-flex items-center justify-center font-bold rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 px-6 py-3 text-sm sm:text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 no-underline"
            >
              Explorar Catálogo de Destinos
            </Link>
          </div>

          {/* Indicadores de la agencia orientados al viajero */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/15">
            <div>
              <span className="block text-xl sm:text-2xl font-black text-amber-300">
                5+
              </span>
              <span className="text-xs text-blue-200">
                Destinos internacionales
              </span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-black text-emerald-300">
                10+
              </span>
              <span className="text-xs text-blue-200">
                Rutas aéreas disponibles
              </span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-black text-sky-300">
                100%
              </span>
              <span className="text-xs text-blue-200">
                Hoteles seleccionados
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de beneficios/pasos de planificación en 3 cortes (1 col móvil, 2 cols tablet, 3 cols desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-black text-sm flex items-center justify-center mb-4">
            01
          </div>
          <h3 className="text-lg font-bold text-slate-800 m-0 mb-2">
            Destinos y Experiencias
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed m-0">
            Conoce ciudades emblemáticas de Europa, Asia y América, su mejor
            temporada climática y las actividades imperdibles en cada país.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-sm flex items-center justify-center mb-4">
            02
          </div>
          <h3 className="text-lg font-bold text-slate-800 m-0 mb-2">
            Vuelos e Itinerarios
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed m-0">
            Compara aerolíneas internacionales, rutas desde Santiago, horarios de
            salida, fechas programadas y cupos de asientos disponibles.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 md:col-span-2 lg:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-sm flex items-center justify-center mb-4">
            03
          </div>
          <h3 className="text-lg font-bold text-slate-800 m-0 mb-2">
            Alojamientos Exclusivos
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed m-0">
            Revisa opciones de hospedaje categorizadas por estrellas, ubicación
            estratégica, servicios incluidos y disponibilidad de habitaciones.
          </p>
        </div>
      </div>
    </section>
  );
}
