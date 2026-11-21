import React from 'react';

// ---------------------------------------------------------------------------
// Molécula: Tarjeta de presentación para un alojamiento individual (GraphQL).
// ---------------------------------------------------------------------------
export default function TarjetaHotel({ hotel }) {
  if (!hotel) return null;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 border-t-4 border-t-emerald-500 shadow-xs hover:shadow-md transition-all duration-200">
      <h4 className="text-lg font-bold text-slate-800 m-0 mb-2">
        🏨 {hotel.nombre}
      </h4>
      <p className="text-sm text-slate-600 m-0 my-1.5">
        📅 <strong>Fechas:</strong> {hotel.fechas}
      </p>
      <p className="text-base font-bold text-slate-900 m-0 my-1.5">
        💵 {hotel.precio}
      </p>
      <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-emerald-200 mt-2">
        🛏️ {hotel.disponibilidad}
      </span>
    </div>
  );
}
