import React from 'react';
import { Link } from 'react-router';

// ---------------------------------------------------------------------------
// Página: Manejo de rutas inexistentes (404).
// ---------------------------------------------------------------------------
export default function PaginaNoEncontrada() {
  return (
    <section className="bg-white p-12 rounded-2xl border border-slate-200 text-center shadow-xs">
      <span className="text-6xl font-black text-blue-600 block mb-3">
        404
      </span>
      <h2 className="text-2xl font-bold text-slate-800 m-0 mb-2">
        Página no encontrada
      </h2>
      <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
        La ruta a la que intentas acceder no existe o fue modificada dentro del sistema.
      </p>

      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Link
          to="/"
          className="inline-flex items-center justify-center font-semibold rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-4 py-2 text-sm transition-all duration-200"
        >
          🏠 Ir al Inicio
        </Link>
        <Link
          to="/destinos"
          className="inline-flex items-center justify-center font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm transition-all duration-200 shadow-xs"
        >
          📍 Ver Catálogo de Destinos
        </Link>
      </div>
    </section>
  );
}
