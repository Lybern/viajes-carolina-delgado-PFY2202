import React from 'react';
import { Link } from 'react-router';

// ---------------------------------------------------------------------------
// Molécula: Tarjeta del catálogo para un destino individual (REST).
// Muestra imagen panorámica, país, temporada, chips de actividades populares
// y enlace hacia la consulta detallada GraphQL.
// ---------------------------------------------------------------------------
export default function TarjetaDestino({ destino }) {
  if (!destino) return null;

  const listaActividades = destino.actividades
    ? destino.actividades.split(',').map((a) => a.trim()).filter(Boolean)
    : [];

  return (
    <article className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Cabecera visual con imagen del destino e insignias flotantes */}
        <div className="relative h-44 bg-slate-900 overflow-hidden">
          {destino.imagen ? (
            <img
              src={destino.imagen}
              alt={`Destino turístico ${destino.nombre}, ${destino.pais}`}
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-800 to-indigo-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />

          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
              {destino.pais}
            </span>
            {destino.precioDesde && (
              <span className="bg-blue-600/95 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                Desde {destino.precioDesde}
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h2 className="text-xl font-extrabold m-0 drop-shadow-sm">
              {destino.nombre}
            </h2>
            {destino.temporada && (
              <p className="text-xs text-blue-100 m-0 mt-0.5">
                Temporada: {destino.temporada}
              </p>
            )}
          </div>
        </div>

        {/* Contenido descriptivo y chips de actividades populares */}
        <div className="p-5 pb-3">
          {destino.descripcion && (
            <p className="text-xs text-slate-600 leading-relaxed m-0 mb-3">
              {destino.descripcion}
            </p>
          )}

          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Actividades populares
            </span>
            <div className="flex flex-wrap gap-1.5">
              {listaActividades.map((actividad) => (
                <span
                  key={actividad}
                  className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-200"
                >
                  {actividad}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Acción hacia la vista detallada de GraphQL */}
      <div className="p-5 pt-3">
        <Link
          to={`/destinos/${destino.id}`}
          className="w-full inline-flex items-center justify-center font-bold rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-600 px-4 py-2.5 text-sm transition-all duration-200 text-center no-underline"
        >
          Ver vuelos y hoteles
        </Link>
      </div>
    </article>
  );
}
