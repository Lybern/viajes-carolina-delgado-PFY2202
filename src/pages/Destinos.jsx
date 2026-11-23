import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { REST_DESTINOS_ENDPOINT } from '../graphql/endpoint';
import Boton from '../components/atoms/Boton';
import EstadoCarga from '../components/molecules/EstadoCarga';
import AlertaError from '../components/molecules/AlertaError';
import BarraBusqueda from '../components/molecules/BarraBusqueda';
import TarjetaDestino from '../components/molecules/TarjetaDestino';

// ---------------------------------------------------------------------------
// Función auxiliar para consultar la API REST mock de destinos.
// Propaga dinámicamente el mensaje real del backend mock y adjunta el código HTTP.
// ---------------------------------------------------------------------------
async function solicitarDestinosRest(tipoError = '', signal) {
  const url = tipoError
    ? `${REST_DESTINOS_ENDPOINT}?error=${encodeURIComponent(tipoError)}`
    : REST_DESTINOS_ENDPOINT;

  try {
    const respuesta = await fetch(url, { signal });

    if (!respuesta.ok) {
      const cuerpoError = await respuesta.json().catch(() => null);
      const mensajeServidor =
        cuerpoError?.mensaje ||
        cuerpoError?.message ||
        `Error inesperado del servidor (código ${respuesta.status}).`;

      const errorHttp = new Error(mensajeServidor);
      errorHttp.status = respuesta.status;
      throw errorHttp;
    }

    return await respuesta.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err;
    }
    if (err instanceof TypeError) {
      const errorRed = new Error(
        'No fue posible conectar con el servidor de destinos. Verifica tu conexión e intenta nuevamente.'
      );
      errorRed.status = 503;
      throw errorRed;
    }
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Página: Catálogo de Destinos (REST).
// Consulta el catálogo únicamente cuando la vista se abre, unificando la carga
// inicial y las recargas posteriores en un solo flujo con AbortController.
// ---------------------------------------------------------------------------
export default function Destinos() {
  const [destinos, setDestinos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [codigoError, setCodigoError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [paisSeleccionado, setPaisSeleccionado] = useState('Todos');
  const [searchParams] = useSearchParams();
  const modoDebug = searchParams.get('debug') === 'true';
  const mostrarControlesPrueba = import.meta.env.DEV || modoDebug;

  // Referencia al AbortController vigente para cancelar peticiones anteriores superpuestas
  const abortControllerRef = useRef(null);

  // Flujo único para carga inicial, actualización y simulación de errores HTTP
  const cargarDestinos = useCallback((tipoError = '') => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controlador = new AbortController();
    abortControllerRef.current = controlador;

    setCargando(true);
    setError('');
    setCodigoError(null);

    solicitarDestinosRest(tipoError, controlador.signal)
      .then((datos) => {
        setDestinos(datos);
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          return;
        }
        setError(err.message);
        setCodigoError(err.status || 500);
      })
      .finally(() => {
        if (!controlador.signal.aborted) {
          setCargando(false);
        }
      });
  }, []);

  // Ejecuta la carga inicial al montar la vista y aborta si el usuario cambia de página
  useEffect(() => {
    cargarDestinos();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [cargarDestinos]);

  // Evita consultas o actualizaciones redundantes si se vuelve a pulsar el mismo país activo
  const manejarSeleccionPais = useCallback(
    (nuevoPais) => {
      if (nuevoPais === paisSeleccionado) {
        return;
      }
      setPaisSeleccionado(nuevoPais);
    },
    [paisSeleccionado]
  );

  // Lista única de países extraída dinámicamente de los datos del servicio simulado
  const paisesDisponibles = useMemo(() => {
    const setPaises = new Set(destinos.map((d) => d.pais).filter(Boolean));
    return Array.from(setPaises);
  }, [destinos]);

  // Normaliza el término una sola vez fuera del bucle y memoriza el resultado filtrado
  const destinosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return destinos.filter((destino) => {
      const coincidePais =
        paisSeleccionado === 'Todos' || destino.pais === paisSeleccionado;
      const coincideTexto =
        !termino ||
        destino.nombre.toLowerCase().includes(termino) ||
        destino.pais.toLowerCase().includes(termino) ||
        destino.actividades.toLowerCase().includes(termino);

      return coincidePais && coincideTexto;
    });
  }, [destinos, busqueda, paisSeleccionado]);

  return (
    <section className="flex flex-col gap-6">
      {/* Encabezado del catálogo de destinos */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-blue-200 mb-2">
            Catálogo Internacional
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 m-0">
            Destinos Turísticos Disponibles
          </h1>
          <p className="text-slate-500 text-sm m-0 mt-1">
            Explora cada país y sus actividades populares antes de revisar vuelos y hoteles.
          </p>
        </div>

        {/* Controles de actualización; los botones de simulación de error solo se muestran en desarrollo */}
        <div className="flex flex-wrap items-center gap-2">
          <Boton
            onClick={() => cargarDestinos()}
            disabled={cargando}
            variant="secondary"
          >
            Actualizar catálogo
          </Boton>

          {mostrarControlesPrueba && (
            <>
              <Boton
                onClick={() => cargarDestinos('404')}
                disabled={cargando}
                variant="simulation"
              >
                Simular 404
              </Boton>

              <Boton
                onClick={() => cargarDestinos('500')}
                disabled={cargando}
                variant="simulation"
              >
                Simular 500
              </Boton>
            </>
          )}
        </div>
      </div>

      {/* Indicador de carga accesible */}
      {cargando && (
        <EstadoCarga mensaje="Cargando catálogo de destinos disponibles..." />
      )}

      {/* Manejo de error propagando el mensaje real del backend mock */}
      {error && (
        <AlertaError
          mensaje={error}
          codigo={codigoError}
          onReintentar={codigoError !== 404 ? () => cargarDestinos() : null}
          onRestablecer={codigoError === 404 ? () => cargarDestinos() : null}
          disabledReintento={cargando}
        />
      )}

      {/* Aviso de resiliencia cuando ocurrió un error del servidor (500) pero se conservan los datos previos en memoria */}
      {!cargando && error && codigoError !== 404 && destinos.length > 0 && (
        <div className="px-4 py-3 bg-amber-50 border-l-4 border-amber-500 rounded-lg text-amber-900 text-xs font-medium">
          Mostrando en pantalla el último catálogo cargado en memoria mientras se restablece la conexión.
        </div>
      )}

      {/* Buscador y listado de tarjetas de destinos (se ocultan si se simuló un 404 de recurso no encontrado) */}
      {!cargando && codigoError !== 404 && destinos.length > 0 && (
        <>
          <BarraBusqueda
            busqueda={busqueda}
            onCambioBusqueda={setBusqueda}
            paises={paisesDisponibles}
            paisSeleccionado={paisSeleccionado}
            onSeleccionarPais={manejarSeleccionPais}
            totalResultados={destinosFiltrados.length}
          />

          {/* Cuadrícula de tarjetas en 3 cortes (móvil: 1 col, tablet: 2 cols, desktop: 3 cols) */}
          {destinosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {destinosFiltrados.map((destino) => (
                <TarjetaDestino
                  key={destino.id}
                  destino={destino}
                  modoDebug={modoDebug}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-sm">
              <p className="text-slate-600 font-medium mb-3">
                No se encontraron destinos que coincidan con "{busqueda}" en la categoría seleccionada.
              </p>
              <Boton
                variant="secondary"
                onClick={() => {
                  setBusqueda('');
                  setPaisSeleccionado('Todos');
                }}
              >
                Limpiar filtros de búsqueda
              </Boton>
            </div>
          )}
        </>
      )}

      {/* Estado vacío si el catálogo no tiene registros y no hay error */}
      {!cargando && !error && destinos.length === 0 && (
        <p className="text-slate-500 italic p-6 bg-white rounded-xl border border-dashed border-slate-300 text-center">
          No hay destinos registrados en el catálogo actualmente.
        </p>
      )}
    </section>
  );
}
