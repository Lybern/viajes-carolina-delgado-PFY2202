import React from 'react';

// ---------------------------------------------------------------------------
// Molécula: Tarjeta de presentación para un vuelo individual (GraphQL).
// Muestra aerolínea, código de vuelo, ruta, horario, fechas, precio y cupos.
// ---------------------------------------------------------------------------
export default function TarjetaVuelo({ vuelo }) {
  if (!vuelo) return null;

  const pocosAsientos =
    vuelo.disponibilidad &&
    vuelo.disponibilidad.toLowerCase().includes('últimos');

  return (
    <article className="bg-white rounded-2xl p-5 border border-slate-200 border-t-4 border-t-blue-600 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
              {vuelo.id ? `Vuelo ${vuelo.id}` : 'Itinerario Aéreo'}
            </span>
            <h4 className="text-lg font-extrabold text-slate-900 m-0">
              {vuelo.aerolinea}
            </h4>
          </div>
          <span
            className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${
              pocosAsientos
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {vuelo.disponibilidad}
          </span>
        </div>

        {vuelo.origen && (
          <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/80 my-2.5">
            <p className="text-xs font-bold text-slate-800 m-0">
              Ruta: {vuelo.origen}
            </p>
            {vuelo.horario && (
              <p className="text-xs text-slate-500 m-0 mt-0.5">
                {vuelo.horario}
              </p>
            )}
          </div>
        )}

        <p className="text-sm text-slate-600 m-0">
          <strong>Fechas:</strong> {vuelo.fechas}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">
          Tarifa ida y vuelta
        </span>
        <span className="text-lg font-black text-slate-900">
          {vuelo.precio}
        </span>
      </div>
    </article>
  );
}
