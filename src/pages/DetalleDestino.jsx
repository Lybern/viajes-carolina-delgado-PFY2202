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
// Consume el endpoint GraphQL simulado mediante useQuery de Apollo Client.
// Lee el parámetro :id de la ruta y permite simular errores con useSearchParams.
// ---------------------------------------------------------------------------
export default function DetalleDestino() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const simularError = searchParams.get('error') === 'graphql';
  const modoDebug = searchParams.get('debug') === 'true';
  const mostrarControlesPrueba =
    import.meta.env.DEV || modoDebug || simularError;
  const rutaCatalogo = modoDebug ? '/destinos?debug=true' : '/destinos';

  const { data, loading, error, refetch } = useQuery(OBTENER_DETALLE_DESTINO, {
    variables: { id, simularError },
  });

  const destino = data?.destino;
  const vuelos = destino?.vuelos || [];
  const hoteles = destino?.hoteles || [];

  const listaActividades = destino?.actividades
    ? destino.actividades.split(',').map((a) => a.trim()).filter(Boolean)
    : [];

  const activarSimulacionError = () => {
    setSearchParams(
      modoDebug ? { debug: 'true', error: 'graphql' } : { error: 'graphql' }
    );
  };

  const limpiarSimulacionError = () => {
    setSearchParams(modoDebug ? { debug: 'true' } : {});
  };

  // Permite reintentar limpiando la simulación de error o reejecutando refetch()
  const manejarReintentoGraphql = () => {
    if (simularError) {
      limpiarSimulacionError();
    } else {
      refetch();
    }
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Barra superior de navegación */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-indigo-200 mb-1.5">
            Itinerario y Estadía
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 m-0">
            Planificación de Vuelos y Hoteles
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm m-0 mt-0.5">
            Revisa las opciones de transporte aéreo y alojamiento disponibles para tu viaje.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to={rutaCatalogo}
            className="inline-flex items-center justify-center font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-3.5 py-2 text-xs sm:text-sm transition-all duration-200 no-underline"
          >
            Volver a destinos
          </Link>

          {/* Controles de simulación visibles en desarrollo o al activar ?debug=true en la URL */}
          {mostrarControlesPrueba && (
            simularError ? (
              <Boton
                variant="simulationActive"
                onClick={limpiarSimulacionError}
              >
                Restaurar consulta
              </Boton>
            ) : (
              <Boton
                variant="simulation"
                onClick={activarSimulacionError}
              >
                Simular error
              </Boton>
            )
          )}
        </div>
      </div>

      {/* Estado de carga accesible */}
      {loading && (
        <EstadoCarga mensaje={`Consultando vuelos y hoteles disponibles para ${id}...`} />
      )}

      {/* Manejo de error propagando el message enviado desde el backend */}
      {error && (
        <AlertaError
          mensaje={error.message}
          onReintentar={manejarReintentoGraphql}
          disabledReintento={loading}
          mostrarVolver={true}
        />
      )}

      {/* Destino inexistente (404 lógico: no ofrece recargar porque el ID no existe, solo volver al catálogo) */}
      {!loading && !error && !destino && (
        <div
          className="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-sm shadow-sm"
          role="alert"
        >
          <h2 className="text-base font-bold m-0 mb-1">
            Destino "{id}" no registrado en el catálogo
          </h2>
          <p className="m-0 mb-4 text-amber-800">
            No existen vuelos ni hoteles asociados al identificador solicitado. Selecciona un destino válido desde nuestro catálogo principal.
          </p>
          <Link
            to="/destinos"
            className="inline-flex items-center justify-center font-semibold rounded-lg bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 px-4 py-2 text-sm transition-all duration-200 no-underline shadow-sm"
          >
            Volver al catálogo de destinos
          </Link>
        </div>
      )}

      {/* Información detallada del destino, sus vuelos y hoteles */}
      {!loading && !error && destino && (
        <div className="flex flex-col gap-6">
          {/* Banner Hero del destino seleccionado */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="relative h-48 sm:h-56 bg-slate-900 overflow-hidden">
              {destino.imagen && (
                <img
                  src={destino.imagen}
                  alt={`Vista panorámica de ${destino.nombre}`}
                  className="w-full h-full object-cover opacity-75"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent flex flex-col justify-end p-6 text-white">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-blue-600/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                    País: {destino.pais}
                  </span>
                  {destino.temporada && (
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
                      Mejor época: {destino.temporada}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black m-0">
                  {destino.nombre}
                </h2>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex flex-col gap-3">
              {destino.descripcion && (
                <p className="text-slate-600 text-sm sm:text-base m-0 leading-relaxed">
                  {destino.descripcion}
                </p>
              )}

              {listaActividades.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Actividades populares:
                  </span>
                  {listaActividades.map((act) => (
                    <span
                      key={act}
                      className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200"
                    >
                      {act}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sección de vuelos */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-extrabold text-slate-800 m-0">
                Vuelos disponibles hacia {destino.nombre}
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {vuelos.length} {vuelos.length === 1 ? 'opción' : 'opciones'}
              </span>
            </div>

            {vuelos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vuelos.map((vuelo, index) => (
                  <TarjetaVuelo key={vuelo.id || index} vuelo={vuelo} />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic p-4 bg-white rounded-xl border border-dashed border-slate-300">
                No hay vuelos registrados para este destino.
              </p>
            )}
          </div>

          {/* Sección de hoteles */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-extrabold text-slate-800 m-0">
                Hoteles disponibles en {destino.nombre}
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {hoteles.length} {hoteles.length === 1 ? 'alojamiento' : 'alojamientos'}
              </span>
            </div>

            {hoteles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hoteles.map((hotel, index) => (
                  <TarjetaHotel key={hotel.id || index} hotel={hotel} />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic p-4 bg-white rounded-xl border border-dashed border-slate-300">
                No hay alojamientos registrados para este destino.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
