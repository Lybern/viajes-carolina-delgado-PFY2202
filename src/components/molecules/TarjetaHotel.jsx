import React from 'react';

// ---------------------------------------------------------------------------
// Molécula: Tarjeta de presentación para un alojamiento individual (GraphQL).
// Muestra categoría, nombre, ubicación, fechas, servicios, tarifa y cupos.
// ---------------------------------------------------------------------------
export default function TarjetaHotel({ hotel }) {
  if (!hotel) return null;

  const pocasHabitaciones =
    hotel.disponibilidad &&
    hotel.disponibilidad.toLowerCase().includes('últimas');

  return (
    <article className="bg-white rounded-2xl p-5 border border-slate-200 border-t-4 border-t-emerald-500 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            {hotel.categoria && (
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                {hotel.categoria}
              </span>
            )}
            <h4 className="text-lg font-extrabold text-slate-900 m-0">
              {hotel.nombre}
            </h4>
          </div>
          <span
            className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${
              pocasHabitaciones
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {hotel.disponibilidad}
          </span>
        </div>

        {hotel.ubicacion && (
          <p className="text-xs font-medium text-slate-500 m-0 mb-2">
            Ubicación: {hotel.ubicacion}
          </p>
        )}

        <p className="text-sm text-slate-600 m-0 my-1.5">
          <strong>Estadía:</strong> {hotel.fechas}
        </p>

        {hotel.servicios && (
          <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/80 mt-2.5">
            <p className="text-xs text-slate-600 m-0 leading-relaxed">
              <strong>Incluye:</strong> {hotel.servicios}
            </p>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">
          Tarifa de alojamiento
        </span>
        <span className="text-lg font-black text-slate-900">
          {hotel.precio}
        </span>
      </div>
    </article>
  );
}
