import React from 'react';
import CampoTexto from '../atoms/CampoTexto';
import Boton from '../atoms/Boton';

// ---------------------------------------------------------------------------
// Molécula: Buscador interactivo con campo de texto y botones de filtro por país.
// ---------------------------------------------------------------------------
export default function BarraBusqueda({
  busqueda,
  onCambioBusqueda,
  paises = [],
  paisSeleccionado = 'Todos',
  onSeleccionarPais,
}) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-3">
      {/* Input de búsqueda */}
      <div className="relative flex items-center">
        <CampoTexto
          type="search"
          placeholder="🔍 Buscar por nombre o actividad (ej. Louvre, playa, templo)..."
          value={busqueda}
          onChange={(e) => onCambioBusqueda(e.target.value)}
          ariaLabel="Buscar destinos por texto"
        />
        {busqueda && (
          <button
            type="button"
            onClick={() => onCambioBusqueda('')}
            className="absolute right-3 text-slate-400 hover:text-slate-600 text-sm cursor-pointer p-1"
            aria-label="Limpiar campo de búsqueda"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filtros rápidos por país */}
      {paises.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 mr-1">País:</span>
          <Boton
            variant={paisSeleccionado === 'Todos' ? 'chipActive' : 'chip'}
            onClick={() => onSeleccionarPais('Todos')}
          >
            Todos
          </Boton>
          {paises.map((pais) => (
            <Boton
              key={pais}
              variant={paisSeleccionado === pais ? 'chipActive' : 'chip'}
              onClick={() => onSeleccionarPais(pais)}
            >
              {pais}
            </Boton>
          ))}
        </div>
      )}
    </div>
  );
}
