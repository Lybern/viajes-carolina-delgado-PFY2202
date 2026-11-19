import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Componente Destinos: Consume la API REST Mock mediante HTTP GET /api/destinos.
// Gestiona el estado local del catálogo, indicadores de carga y manejo de errores.
// ---------------------------------------------------------------------------
function Destinos() {
  const [destinos, setDestinos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // AbortController permite cancelar la petición activa si el usuario sale
    // de la vista antes de completar la descarga, evitando fugas de memoria.
    const controller = new AbortController();

    async function cargarDestinos() {
      try {
        setCargando(true);
        setError(null);

        // Petición a la API REST mock interceptada por MSW
        const respuesta = await fetch('/api/destinos', { signal: controller.signal });

        if (!respuesta.ok) {
          const body = await respuesta.json().catch(() => null);
          throw new Error(body?.message || `Error del servidor (${respuesta.status})`);
        }

        const data = await respuesta.json();
        setDestinos(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'No se pudo conectar con el servicio de destinos.');
        }
      } finally {
        setCargando(false);
      }
    }

    cargarDestinos();

    // Limpieza al desmontar el componente
    return () => controller.abort();
  }, []);

  // Vista de espera mientras se obtienen los datos de la API REST
  if (cargando) {
    return (
      <div className="mensaje-estado" role="status">
        <div className="spinner"></div>
        <p>Cargando destinos...</p>
      </div>
    );
  }

  // Vista de error ante problemas de red o respuesta HTTP no exitosa
  if (error) {
    return (
      <div className="mensaje-error" role="alert">
        <p><strong>Error:</strong> {error}</p>
        <button onClick={() => window.location.reload()} className="btn-secundario">
          Reintentar conexión
        </button>
      </div>
    );
  }

  // Renderizado de las tarjetas con la información de destinos obtenida por REST
  return (
    <div>
      <h2>Destinos Disponibles</h2>
      <div className="grid-destinos">
        {destinos.map((destino) => (
          <div key={destino.id} className="card-destino">
            <h3>{destino.nombre}</h3>
            <p className="pais">📍 País: <strong>{destino.pais}</strong></p>
            <p className="actividades">🎯 <strong>Actividades populares:</strong> {destino.actividades}</p>
            {/* Navegación declarativa hacia el detalle GraphQL del destino */}
            <Link to={`/destino/${destino.id}`} className="btn-detalle">
              Ver vuelos y hoteles →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Destinos;
