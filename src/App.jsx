import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, NavLink, Link } from 'react-router';
import Inicio from './pages/Inicio';
import Destinos from './pages/Destinos';
import DetalleDestino from './pages/DetalleDestino';
import PaginaNoEncontrada from './pages/PaginaNoEncontrada';
import './App.css';

// ---------------------------------------------------------------------------
// Función de consulta a la API REST mock según la arquitectura del docente.
// Maneja errores de servidor (404, 500) y contingencias de red (TypeError).
// ---------------------------------------------------------------------------
async function obtenerDestinos(tipoError = '', signal) {
  const endpoint = tipoError
    ? `/api/destinos?error=${tipoError}`
    : `/api/destinos`;

  try {
    const respuesta = await fetch(endpoint, { signal });

    if (!respuesta.ok) {
      if (respuesta.status === 404) {
        throw new Error('Recurso no encontrado');
      }
      if (respuesta.status === 500) {
        throw new Error('Error interno del servidor');
      }
      throw new Error(`Error inesperado del servidor (${respuesta.status})`);
    }

    return await respuesta.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        'Ocurrió un error de conexión, por favor intente nuevamente.',
        { cause: error }
      );
    }
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Componente principal: Administra el estado global del catálogo REST,
// el ciclo de vida con AbortController, y las rutas de la aplicación.
// ---------------------------------------------------------------------------
export default function App() {
  const [destinos, setDestinos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Carga manual o reactiva con soporte de parámetros de simulación
  const cargarDestinos = useCallback((tipoError = '') => {
    setCargando(true);
    setError('');

    obtenerDestinos(tipoError)
      .then((data) => setDestinos(data))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  // Carga inicial al montar la aplicación con cancelación limpia
  useEffect(() => {
    const controlador = new AbortController();

    obtenerDestinos('', controlador.signal)
      .then((data) => setDestinos(data))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!controlador.signal.aborted) {
          setCargando(false);
        }
      });

    return () => {
      controlador.abort();
    };
  }, []);

  return (
    <div className="App">
      {/* Cabecera institucional */}
      <header className="App-header">
        <div className="header-contenido">
          <Link to="/" className="brand-link">
            <span className="brand-icono">✈️</span>
            <div>
              <h1>Agencia de Viajes Global</h1>
              <p>Explora destinos del mundo y planifica tu próximo viaje</p>
            </div>
          </Link>
        </div>
      </header>

      <div className="content">
        {/* Menú de navegación accesible */}
        <nav className="side-menu" aria-label="Navegación principal">
          <h2>Navegación</h2>
          <ul>
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) => (isActive ? 'nav-link activo' : 'nav-link')}
              >
                🏠 Inicio
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/destinos"
                className={({ isActive }) => (isActive ? 'nav-link activo' : 'nav-link')}
              >
                📍 Destinos
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Enrutamiento hacia las vistas en src/pages/ */}
        <main className="main-content" id="contenido-principal">
          <Routes>
            {/* Portada institucional */}
            <Route path="/" element={<Inicio />} />

            {/* Catálogo REST de destinos con props provistas por App */}
            <Route
              path="/destinos"
              element={
                <Destinos
                  destinos={destinos}
                  cargando={cargando}
                  error={error}
                  cargarDestinos={cargarDestinos}
                />
              }
            />

            {/* Detalle GraphQL del destino seleccionado (soporta plural y singular) */}
            <Route path="/destinos/:id" element={<DetalleDestino />} />
            <Route path="/destino/:id" element={<DetalleDestino />} />

            {/* Ruta comodín para páginas inexistentes (404) */}
            <Route path="*" element={<PaginaNoEncontrada />} />
          </Routes>
        </main>
      </div>

      {/* Pie de página institucional */}
      <footer>
        <p>© 2026 Agencia de Viajes Global. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
