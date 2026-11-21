import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, NavLink, Link } from 'react-router';
import Inicio from './pages/Inicio';
import Destinos from './pages/Destinos';
import DetalleDestino from './pages/DetalleDestino';
import PaginaNoEncontrada from './pages/PaginaNoEncontrada';

// ---------------------------------------------------------------------------
// Función de consulta a la API REST mock para el catálogo de destinos.
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
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800 antialiased">
      {/* Cabecera institucional con gradiente y adaptabilidad móvil/desktop */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 no-underline text-white">
            <span className="text-3xl bg-white/10 p-2 rounded-xl border border-white/20">
              ✈️
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black m-0 tracking-tight">
                Agencia de Viajes Global
              </h1>
              <p className="text-xs sm:text-sm text-blue-200 m-0">
                Explora destinos del mundo y planifica tu próximo viaje
              </p>
            </div>
          </Link>
        </div>
      </header>

      {/* Contenedor principal con 3 cortes responsivos (móvil: flex-col, tablet/desktop: flex-row) */}
      <div className="max-w-6xl mx-auto w-full px-4 py-6 sm:py-8 flex flex-col md:flex-row gap-6 items-start flex-1">
        {/* Menú de navegación lateral */}
        <nav
          className="w-full md:w-56 bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex-shrink-0"
          aria-label="Navegación principal"
        >
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider m-0 mb-3 pb-2 border-b border-slate-100">
            Navegación
          </h2>
          <ul className="list-none p-0 m-0 flex flex-row md:flex-col gap-2">
            <li className="flex-1 md:flex-initial">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex items-center justify-center md:justify-start gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 no-underline ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                🏠 Inicio
              </NavLink>
            </li>
            <li className="flex-1 md:flex-initial">
              <NavLink
                to="/destinos"
                className={({ isActive }) =>
                  `flex items-center justify-center md:justify-start gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 no-underline ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                📍 Destinos
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Área de contenido para las páginas */}
        <main className="flex-1 w-full min-w-0" id="contenido-principal">
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
      <footer className="text-center py-6 bg-white border-t border-slate-200 text-slate-500 text-xs mt-auto">
        <p className="m-0">© 2026 Agencia de Viajes Global. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
