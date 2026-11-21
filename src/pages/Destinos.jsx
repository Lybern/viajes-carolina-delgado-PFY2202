import React, { useState, useMemo } from 'react';
import Boton from '../components/atoms/Boton';
import EstadoCarga from '../components/molecules/EstadoCarga';
import AlertaError from '../components/molecules/AlertaError';
import BarraBusqueda from '../components/molecules/BarraBusqueda';
import TarjetaDestino from '../components/molecules/TarjetaDestino';

// ---------------------------------------------------------------------------
// Página: Catálogo de Destinos (REST).
// Ensambla los componentes de presentación (Átomos y Moléculas)
// y recibe el estado y las funciones de control provistas por App.
// ---------------------------------------------------------------------------
export default function Destinos({
  destinos = [],
  cargando,
  error,
  cargarDestinos,
}) {
  const [busqueda, setBusqueda] = useState('');
  const [paisSeleccionado, setPaisSeleccionado] = useState('Todos');

  // Lista única de países para los filtros
  const paisesDisponibles = useMemo(() => {
    const setPaises = new Set(destinos.map((d) => d.pais).filter(Boolean));
    return Array.from(setPaises);
  }, [destinos]);

  // Filtrado reactivo de destinos por texto y país
  const destinosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return destinos.filter((destino) => {
      const coincidePais =
        paisSeleccionado === 'Todos' || destino.pais === paisSeleccionado;
      const coincideTexto =
        !termino ||
        destino.nombre.toLowerCase().includes(termino) ||
        destino.actividades.toLowerCase().includes(termino);

      return coincidePais && coincideTexto;
    });
  }, [destinos, busqueda, paisSeleccionado]);

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 m-0 mb-1">
          Destinos turísticos
        </h1>
        <p className="text-slate-500 text-sm m-0">
          Los destinos se consultan mediante una petición al servicio REST.
        </p>
      </div>

      {/* Controles de prueba para simulación de respuestas */}
      <div className="flex flex-wrap gap-2.5">
        <Boton
          onClick={() => cargarDestinos()}
          disabled={cargando}
          variant="secondary"
        >
          Actualizar destinos
        </Boton>

        <Boton
          onClick={() => cargarDestinos('404')}
          disabled={cargando}
          variant="simulation"
        >
          Simular error 404
        </Boton>

        <Boton
          onClick={() => cargarDestinos('500')}
          disabled={cargando}
          variant="simulation"
        >
          Simular error 500
        </Boton>
      </div>

      {/* Indicador de carga accesible */}
      {cargando && <EstadoCarga mensaje="Cargando destinos..." />}

      {/* Manejo de error con reintento */}
      {error && (
        <AlertaError
          mensaje={error}
          onReintentar={() => cargarDestinos()}
          disabledReintento={cargando}
        />
      )}

      {/* Sin destinos registrados */}
      {!cargando && !error && destinos.length === 0 && (
        <p className="text-slate-500 italic p-4 bg-white rounded-lg border border-dashed border-slate-300">
          No hay destinos disponibles por el momento.
        </p>
      )}

      {/* Buscador y catálogo de destinos */}
      {!cargando && !error && destinos.length > 0 && (
        <>
          <BarraBusqueda
            busqueda={busqueda}
            onCambioBusqueda={setBusqueda}
            paises={paisesDisponibles}
            paisSeleccionado={paisSeleccionado}
            onSeleccionarPais={setPaisSeleccionado}
          />

          {/* Cuadrícula de tarjetas de destinos (3 cortes: móvil 1 col, tablet 2 cols, desktop 3 cols) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {destinosFiltrados.map((destino) => (
              <TarjetaDestino key={destino.id} destino={destino} />
            ))}
          </div>

          {destinosFiltrados.length === 0 && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
              <p className="text-slate-600 mb-3">
                🔍 No se encontraron destinos para tu búsqueda.
              </p>
              <Boton
                variant="secondary"
                onClick={() => {
                  setBusqueda('');
                  setPaisSeleccionado('Todos');
                }}
              >
                Limpiar filtros
              </Boton>
            </div>
          )}
        </>
      )}
    </section>
  );
}
