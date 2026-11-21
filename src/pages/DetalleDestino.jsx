import React from 'react';
import { useQuery } from '@apollo/client/react';
import { Link, useParams, useSearchParams } from 'react-router';
import { OBTENER_DETALLE_DESTINO } from '../graphql/operaciones';
import Boton from '../components/atoms/Boton';
import EstadoCarga from '../components/molecules/EstadoCarga';
import AlertaError from '../components/molecules/AlertaError';
import TarjetaVuelo from '../components/molecules/TarjetaVuelo';
import TarjetaHotel from '../components/molecules/TarjetaHotel';

// ---------------------------------------------------------------------------
// Página: Detalle de Viaje (GraphQL).
// Ensambla los componentes de presentación y consume GraphQL mediante useQuery.
// Lee el parámetro de ruta (:id) y alterna errores con useSearchParams.
// ---------------------------------------------------------------------------
export default function DetalleDestino() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const simularError = searchParams.get('error') === 'graphql';

  const { data, loading, error, refetch } = useQuery(OBTENER_DETALLE_DESTINO, {
    variables: { id, simularError },
  });

  const destino = data?.destino;
  const vuelos = destino?.vuelos || [];
  const hoteles = destino?.hoteles || [];

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 m-0 mb-1">
          Detalle del destino
        </h1>
        <p className="text-slate-500 text-sm m-0">
          El catálogo se obtuvo mediante REST. Este detalle se consulta mediante
          GraphQL simulado con MSW.
        </p>
      </div>

      {/* Controles de navegación y prueba de estados */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/destinos"
          className="inline-flex items-center justify-center font-semibold rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-4 py-2 text-sm transition-all duration-200"
        >
          Volver al catálogo
        </Link>

        {simularError ? (
          <Boton
            variant="simulationActive"
            onClick={() => setSearchParams({})}
          >
            Desactivar error simulado
          </Boton>
        ) : (
          <Boton
            variant="simulation"
            onClick={() => setSearchParams({ error: 'graphql' })}
          >
            Simular error GraphQL
          </Boton>
        )}
      </div>

      {/* Estado de carga accesible */}
      {loading && (
        <EstadoCarga mensaje={`Cargando detalle del destino ${id}...`} />
      )}

      {/* Manejo de error de GraphQL */}
      {error && (
        <AlertaError
          mensaje={error.message}
          onReintentar={!simularError ? () => refetch() : null}
          disabledReintento={loading}
          mostrarVolver={false}
        />
      )}

      {/* Destino no encontrado */}
      {!loading && !error && !destino && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm" role="alert">
          <p className="font-medium mb-3">
            No se encontró un destino con el identificador {id}. Verifica el
            enlace o vuelve al catálogo.
          </p>
          <Link
            to="/destinos"
            className="inline-flex items-center justify-center font-semibold rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-4 py-2 text-sm transition-all duration-200"
          >
            Volver al catálogo
          </Link>
        </div>
      )}

      {/* Información detallada de vuelos y hoteles */}
      {!loading && !error && destino && (
        <div className="flex flex-col gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-800 m-0">
                {destino.nombre}
              </h2>
              <p className="text-xs text-slate-500 m-0 mt-1">
                Opciones disponibles para tu itinerario
              </p>
            </div>
            <span className="inline-block bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
              📍 {destino.pais}
            </span>
          </div>

          {/* Sección de vuelos (GraphQL) */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 m-0 mb-3 flex items-center gap-2">
              ✈️ Vuelos disponibles
            </h3>
            {vuelos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vuelos.map((vuelo, index) => (
                  <TarjetaVuelo key={index} vuelo={vuelo} />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic p-4 bg-white rounded-lg border border-dashed border-slate-300">
                No hay vuelos registrados para este destino.
              </p>
            )}
          </div>

          {/* Sección de hoteles (GraphQL) */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 m-0 mb-3 flex items-center gap-2">
              🏨 Hoteles disponibles
            </h3>
            {hoteles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hoteles.map((hotel, index) => (
                  <TarjetaHotel key={index} hotel={hotel} />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic p-4 bg-white rounded-lg border border-dashed border-slate-300">
                No hay alojamientos registrados para este destino.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
