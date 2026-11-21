import React from 'react';
import { Link } from 'react-router';

// ---------------------------------------------------------------------------
// Molécula / Organismo: Tarjeta del catálogo para un destino individual.
// ---------------------------------------------------------------------------
export default function TarjetaDestino({ destino }) {
  if (!destino) return null;

  return (
    <article className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-800 m-0 mb-2">
          {destino.nombre}
        </h2>
        <span className="inline-block bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200 mb-3">
          📍 País: {destino.pais}
        </span>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          🎯 <strong>Actividades:</strong> {destino.actividades}
        </p>
      </div>

      <Link
        to={`/destinos/${destino.id}`}
        className="inline-flex items-center justify-center font-semibold rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-600 px-4 py-2 text-sm transition-all duration-200 mt-2 text-center"
      >
        Ver detalle →
      </Link>
    </article>
  );
}
