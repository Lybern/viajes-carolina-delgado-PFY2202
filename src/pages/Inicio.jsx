import React from 'react';
import { Link } from 'react-router';

// ---------------------------------------------------------------------------
// Página: Portada institucional y bienvenida.
// ---------------------------------------------------------------------------
export default function Inicio() {
  return (
    <section className="flex flex-col gap-6">
      {/* Hero Banner */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs border-l-6 border-l-blue-600">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 m-0 mb-3">
          Bienvenido a Agencia de Viajes Global
        </h2>
        <p className="text-slate-600 text-base leading-relaxed m-0 mb-6 max-w-2xl">
          Tu plataforma integral para descubrir destinos inolvidables,
          itinerarios de vuelo y las mejores opciones de alojamiento.
        </p>

        <div>
          <Link
            to="/destinos"
            className="inline-flex items-center justify-center font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base shadow-sm hover:shadow-md transition-all duration-200"
          >
            Explorar Catálogo de Destinos →
          </Link>
        </div>
      </div>

      {/* Grid de características en 3 cortes (1 col móvil, 2 cols tablet, 3 cols desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-3xl mb-3 inline-block">🌍</span>
          <h3 className="text-lg font-bold text-slate-800 m-0 mb-2">
            Catálogo REST
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed m-0">
            Consulta información actualizada de países y sus actividades
            turísticas más destacadas.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-3xl mb-3 inline-block">⚡</span>
          <h3 className="text-lg font-bold text-slate-800 m-0 mb-2">
            Consultas GraphQL
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed m-0">
            Obtén detalles en tiempo real sobre vuelos, disponibilidad de asientos
            y tarifas de hoteles para cada destino.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs md:col-span-2 lg:col-span-1">
          <span className="text-3xl mb-3 inline-block">🛡️</span>
          <h3 className="text-lg font-bold text-slate-800 m-0 mb-2">
            Resiliencia y Conectividad
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed m-0">
            Gestión de contingencias con alertas accesibles y
            reintentos directos sin recargar el navegador.
          </p>
        </div>
      </div>
    </section>
  );
}
