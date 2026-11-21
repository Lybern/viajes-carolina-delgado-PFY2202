import React from 'react';
import { useQuery } from '@apollo/client/react';
import { Link, useParams, useSearchParams } from 'react-router';
import { OBTENER_DETALLE_DESTINO } from '../graphql/operaciones';

// ---------------------------------------------------------------------------
// Vista DetalleDestino: Consulta de opciones de viaje parametrizadas.
// Consume GraphQL mediante useQuery, gestiona parámetros de ruta (:id)
// y alternancia del error simulado mediante useSearchParams (?error=graphql).
// Incluye vuelos y hoteles según los requerimientos de la Agencia de Viajes.
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
    <section className="detalle-destino-vista">
      <h1>Detalle del destino</h1>

      <p>
        El catálogo se obtuvo mediante REST. Este detalle se consulta mediante
        GraphQL simulado con MSW.
      </p>

      {/* Controles de navegación y prueba de estados */}
      <div className="acciones">
        <Link to="/destinos" className="btn-secundario">
          Volver al catálogo
        </Link>

        {simularError ? (
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className="btn-simulacion activo"
          >
            Desactivar error simulado
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setSearchParams({ error: 'graphql' })}
            className="btn-simulacion"
          >
            Simular error GraphQL
          </button>
        )}
      </div>

      {/* Estado de carga accesible */}
      {loading && (
        <div className="mensaje-estado" role="status">
          <div className="spinner"></div>
          <p>Cargando detalle del destino...</p>
        </div>
      )}

      {/* Manejo de error de GraphQL con reintento condicional */}
      {error && (
        <div className="mensaje-error" role="alert">
          <p>{error.message}</p>

          {!simularError && (
            <button
              type="button"
              onClick={() => refetch()}
              disabled={loading}
              className="btn-reintentar"
            >
              Reintentar
            </button>
          )}
        </div>
      )}

      {/* Manejo de destino inexistente cuando data.destino es null */}
      {!loading && !error && !destino && (
        <div className="mensaje-error" role="alert">
          <p>
            No se encontró un destino con el identificador {id}. Verifica el
            enlace o vuelve al catálogo.
          </p>
          <Link to="/destinos" className="btn-secundario">
            Volver al catálogo
          </Link>
        </div>
      )}

      {/* Despliegue de información de vuelos y hoteles para el destino */}
      {!loading && !error && destino && (
        <div className="detalle-contenido">
          <div className="detalle-encabezado-destino">
            <h2>{destino.nombre}</h2>
            <span className="destino-pais-badge">📍 {destino.pais}</span>
          </div>

          {/* Sección de vuelos (GraphQL) */}
          <div className="bloque-opciones">
            <h3>✈️ Vuelos disponibles</h3>
            {vuelos.length > 0 ? (
              <div className="grid-cards">
                {vuelos.map((vuelo, index) => (
                  <div key={index} className="card-item vuelo">
                    <h4>{vuelo.aerolinea}</h4>
                    <p>📅 <strong>Fechas:</strong> {vuelo.fechas}</p>
                    <p className="precio">💵 {vuelo.precio}</p>
                    <p className="disponibilidad">🎟️ {vuelo.disponibilidad}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mensaje-vacio">No hay vuelos registrados para este destino.</p>
            )}
          </div>

          {/* Sección de hoteles (GraphQL) */}
          <div className="bloque-opciones">
            <h3>🏨 Hoteles disponibles</h3>
            {hoteles.length > 0 ? (
              <div className="grid-cards">
                {hoteles.map((hotel, index) => (
                  <div key={index} className="card-item hotel">
                    <h4>{hotel.nombre}</h4>
                    <p>📅 <strong>Fechas:</strong> {hotel.fechas}</p>
                    <p className="precio">💵 {hotel.precio}</p>
                    <p className="disponibilidad">🛏️ {hotel.disponibilidad}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mensaje-vacio">No hay alojamientos registrados para este destino.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
