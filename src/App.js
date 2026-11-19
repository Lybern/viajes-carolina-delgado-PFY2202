import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import './App.css';

// ---------------------------------------------------------------------------
// Definición de la consulta GraphQL utilizando la etiqueta gql de Apollo Client.
// A diferencia de REST, en GraphQL el cliente define exactamente qué campos
// necesita recibir (evitando over-fetching y under-fetching).
// La consulta recibe la variable obligatoria $destino de tipo String.
// ---------------------------------------------------------------------------
const GET_DETALLE_VIAJE = gql`
  query GetDetalleViaje($destino: String!) {
    vuelos {
      aerolinea
      fechas
      precio
      disponibilidad
    }
    hoteles {
      nombre
      fechas
      precio
      disponibilidad
    }
  }
`;

// ---------------------------------------------------------------------------
// Componente principal de la aplicación.
// Configura el enrutador BrowserRouter para gestionar la navegación SPA
// sin recargar la página en el navegador.
// ---------------------------------------------------------------------------
function App() {
  return (
    <Router>
      <div className="App">
        {/* Cabecera general */}
        <header className="App-header">
          <h1>Agencia de Viajes Global</h1>
          <p>Explora destinos del mundo y planifica tu próximo viaje</p>
        </header>

        <div className="content">
          {/* Menú de navegación lateral con enlaces declarativos Link */}
          <nav className="side-menu" aria-label="Menú principal">
            <h2>Navegación</h2>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/destinos">Destinos</Link></li>
            </ul>
          </nav>

          {/* Área principal donde se renderizan las vistas según la URL activa */}
          <main className="main-content">
            <Routes>
              {/* Ruta principal: Portada de bienvenida */}
              <Route path="/" element={<Inicio />} />

              {/* Ruta REST: Listado de destinos turísticos */}
              <Route path="/destinos" element={<ListaDestinos />} />

              {/* Ruta GraphQL: Detalle parametrizado de vuelos y hoteles por destino */}
              <Route path="/destino/:destino" element={<DetalleViaje />} />

              {/* Ruta comodín (*): Captura direcciones inexistentes (Error 404) */}
              <Route path="*" element={<NoEncontrado />} />
            </Routes>
          </main>
        </div>

        {/* Pie de página informativo */}
        <footer>
          <p>© 2026 Agencia de Viajes Global. Todos los derechos reservados.</p>
        </footer>
      </div>
    </Router>
  );
}

// ---------------------------------------------------------------------------
// Vista de inicio: Presenta la agencia e invita a explorar el catálogo.
// No realiza peticiones de red al montarse para optimizar la carga inicial.
// ---------------------------------------------------------------------------
function Inicio() {
  return (
    <div className="card-bienvenida">
      <h2>Encuentra tu próximo destino</h2>
      <p>
        Descubre opciones de viaje por el mundo con información detallada de cada país y sus actividades más populares.
      </p>
      <p>
        Elige un destino para consultar vuelos y hoteles disponibles en tiempo real.
      </p>
      <Link to="/destinos" className="btn-primario">
        Ver catálogo de destinos
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Vista de Destinos: Consume la API REST Mock mediante HTTP GET /api/destinos.
// Utiliza useState para el estado local y useEffect para disparar la petición
// únicamente cuando el usuario ingresa a esta vista.
// ---------------------------------------------------------------------------
function ListaDestinos() {
  // Estados para almacenar los datos recibidos, el indicador de carga y posibles errores
  const [destinos, setDestinos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // AbortController permite cancelar la solicitud si el componente se desmonta
    // antes de recibir la respuesta, evitando fugas de memoria o respuestas desfasadas.
    const controller = new AbortController();

    async function cargarDestinos() {
      try {
        setCargando(true);
        setError(null);

        // Llamada a la API REST mock interceptada por MSW en el navegador
        const respuesta = await fetch('/api/destinos', { signal: controller.signal });

        // Si el estado HTTP no es exitoso (ej. 404 o 500), leemos el mensaje retornado
        if (!respuesta.ok) {
          const body = await respuesta.json().catch(() => null);
          throw new Error(body?.message || `Error del servidor (${respuesta.status})`);
        }

        const data = await respuesta.json();
        setDestinos(data);
      } catch (err) {
        // Ignoramos el error intencional cuando la petición fue cancelada por el cleanup
        if (err.name !== 'AbortError') {
          setError(err.message || 'No se pudo conectar con el servicio de destinos.');
        }
      } finally {
        setCargando(false);
      }
    }

    cargarDestinos();

    // Función de limpieza para abortar la petición vigente al desmontar
    return () => controller.abort();
  }, []);

  // Renderizado condicional durante la espera con indicador accesible
  if (cargando) {
    return (
      <div className="mensaje-estado" role="status">
        <div className="spinner"></div>
        <p>Cargando destinos...</p>
      </div>
    );
  }

  // Renderizado condicional ante un fallo de red o respuesta HTTP no exitosa
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

  // Renderizado del catálogo de destinos obtenido desde la API REST
  return (
    <div>
      <h2>Destinos Disponibles</h2>
      <div className="grid-destinos">
        {destinos.map((destino) => (
          <div key={destino.id} className="card-destino">
            <h3>{destino.nombre}</h3>
            <p className="pais">📍 País: <strong>{destino.pais}</strong></p>
            <p className="actividades">🎯 <strong>Actividades populares:</strong> {destino.actividades}</p>
            {/* Enlace dinámico que navega hacia la vista GraphQL del destino elegido */}
            <Link to={`/destino/${destino.id}`} className="btn-detalle">
              Ver vuelos y hoteles →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Vista de Detalle: Consume la API GraphQL Mock mediante Apollo Client.
// Extrae el parámetro :destino desde la URL con useParams() y ejecuta useQuery().
// Permite consultar los vuelos y hoteles detallados del destino seleccionado.
// ---------------------------------------------------------------------------
function DetalleViaje() {
  // useParams extrae el valor del parámetro dinámico configurado en la ruta (/destino/:destino)
  const { destino } = useParams();

  // useQuery gestiona automáticamente el ciclo de vida de la consulta GraphQL,
  // la caché en memoria (InMemoryCache) y los estados loading, error y data.
  const { loading, error, data } = useQuery(GET_DETALLE_VIAJE, {
    variables: { destino },
  });

  // Estado de carga mientras Apollo Client consulta el mock de GraphQL
  if (loading) {
    return (
      <div className="mensaje-estado" role="status">
        <div className="spinner"></div>
        <p>Consultando opciones para {destino}...</p>
      </div>
    );
  }

  // Estado de error si la operación GraphQL devuelve un error en el cuerpo JSON
  if (error) {
    return (
      <div className="mensaje-error" role="alert">
        <p><strong>Error:</strong> {error.message}</p>
        <Link to="/destinos" className="btn-secundario">← Volver a destinos</Link>
      </div>
    );
  }

  // Desestructuración de los arreglos de vuelos y hoteles obtenidos desde data
  const { vuelos = [], hoteles = [] } = data || {};

  return (
    <div>
      <div className="header-seccion">
        <h2>Opciones de viaje para {destino}</h2>
        <Link to="/destinos" className="btn-volver">← Volver a destinos</Link>
      </div>

      {/* Bloque de Vuelos obtenidos desde GraphQL */}
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

      {/* Bloque de Hoteles obtenidos desde GraphQL */}
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

// ---------------------------------------------------------------------------
// Vista 404: Se activa mediante la ruta comodín path="*" cuando el usuario
// navega a una dirección que no coincide con ninguna ruta definida.
// ---------------------------------------------------------------------------
function NoEncontrado() {
  return (
    <div className="mensaje-error">
      <h2>404 - Página no encontrada</h2>
      <p>La ruta que buscas no existe.</p>
      <Link to="/" className="btn-secundario">Volver al inicio</Link>
    </div>
  );
}

export default App;
