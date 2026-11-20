import React from 'react';
import { useParams, Link } from 'react-router';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

// ---------------------------------------------------------------------------
// Consulta GraphQL parametrizada para obtener vuelos y hoteles del destino.
// El cliente define con exactitud los campos que necesita para la vista.
// ---------------------------------------------------------------------------
const GET_DETALLE_VIAJE = gql`
  query GetDetalleViaje($destino: String!) {
    vuelos(destino: $destino) {
      aerolinea
      fechas
      precio
      disponibilidad
    }
    hoteles(destino: $destino) {
      nombre
      fechas
      precio
      disponibilidad
    }
  }
`;

// ---------------------------------------------------------------------------
// Componente DetalleViaje: Lee el parámetro de ruta con useParams y ejecuta useQuery.
// Maneja automáticamente la caché de Apollo, estados de carga y errores de consulta.
// ---------------------------------------------------------------------------
function DetalleViaje() {
  const { destino } = useParams();

  const { loading, error, data } = useQuery(GET_DETALLE_VIAJE, {
    variables: { destino },
  });

  if (loading) {
    return (
      <div className="mensaje-estado" role="status">
        <div className="spinner"></div>
        <p>Consultando opciones para {destino}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mensaje-error" role="alert">
        <p><strong>Error:</strong> {error.message}</p>
        <Link to="/destinos" className="btn-secundario">← Volver a destinos</Link>
      </div>
    );
  }

  const { vuelos = [], hoteles = [] } = data || {};

  return (
    <div>
      <div className="header-seccion">
        <h2>Opciones de viaje para {destino}</h2>
        <Link to="/destinos" className="btn-volver">← Volver a destinos</Link>
      </div>

      {/* Listado de vuelos obtenidos desde GraphQL */}
      <section className="bloque-opciones">
        <h3>✈️ Vuelos disponibles</h3>
        {vuelos.length > 0 ? (
          <div className="grid-cards">
            {vuelos.map((vuelo, index) => (
              <div key={index} className="card-item vuelo">
                <h4>{vuelo.aerolinea}</h4>
                <p>📅 <strong>Fechas:</strong> {vuelo.fechas}</p>
                <p className="precio">💵 <strong>Precio:</strong> {vuelo.precio}</p>
                <p className="disponibilidad">🎟️ {vuelo.disponibilidad}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay vuelos disponibles para este destino.</p>
        )}
      </section>

      {/* Listado de hoteles obtenidos desde GraphQL */}
      <section className="bloque-opciones">
        <h3>🏨 Hoteles disponibles</h3>
        {hoteles.length > 0 ? (
          <div className="grid-cards">
            {hoteles.map((hotel, index) => (
              <div key={index} className="card-item hotel">
                <h4>{hotel.nombre}</h4>
                <p>📅 <strong>Fechas:</strong> {hotel.fechas}</p>
                <p className="precio">💵 <strong>Precio:</strong> {hotel.precio}</p>
                <p className="disponibilidad">🛏️ {hotel.disponibilidad}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay hoteles disponibles para este destino.</p>
        )}
      </section>
    </div>
  );
}

export default DetalleViaje;
