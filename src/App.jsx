import React from 'react';
import { Routes, Route, NavLink, Link, useSearchParams } from 'react-router';
import Inicio from './pages/Inicio';
import Destinos from './pages/Destinos';
import DetalleDestino from './pages/DetalleDestino';
import PaginaNoEncontrada from './pages/PaginaNoEncontrada';

// ---------------------------------------------------------------------------
// Componente principal: Define el Layout general y las rutas con react-router.
// La consulta de destinos se delega a la vista Destinos para evitar descargas
// innecesarias al abrir la portada de Inicio.
// ---------------------------------------------------------------------------
export default function App() {
  const [searchParams] = useSearchParams();
  const modoDebug = searchParams.get('debug') === 'true';
  const rutaInicio = modoDebug ? '/?debug=true' : '/';
  const rutaDestinos = modoDebug ? '/destinos?debug=true' : '/destinos';

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800 antialiased">
      {/* Cabecera institucional con gradiente y adaptabilidad móvil/desktop */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-800 text-white shadow-md border-b border-blue-900/40">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between flex-wrap gap-4">
          <Link to={rutaInicio} className="flex items-center gap-3.5 no-underline text-white group">
            <div className="w-11 h-11 bg-white/10 group-hover:bg-white/20 rounded-xl border border-white/20 shadow-sm flex items-center justify-center transition-all duration-200">
              <svg
                width="24"
                height="24"
                className="w-6 h-6 text-blue-200 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black m-0 tracking-tight">
                Agencia de Viajes Global
              </h1>
              <p className="text-xs sm:text-sm text-blue-200 m-0">
                Explora destinos del mundo y planifica tu próximo viaje
              </p>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-flex items-center gap-2 bg-blue-900/60 border border-blue-400/30 text-blue-100 text-xs font-semibold px-3 py-1.5 rounded-full">
              <svg
                width="14"
                height="14"
                className="w-3.5 h-3.5 text-sky-300 flex-shrink-0 rotate-45"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
              Temporada 2026 - 2027 Disponible
            </span>
          </div>
        </div>
      </header>

      {/* Contenedor principal con 3 cortes responsivos (móvil: flex-col, tablet/desktop: flex-row) */}
      <div className="max-w-6xl mx-auto w-full px-4 py-6 sm:py-8 flex flex-col md:flex-row gap-6 items-start flex-1">
        {/* Menú de navegación lateral */}
        <nav
          className="w-full md:w-60 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex-shrink-0"
          aria-label="Navegación principal"
        >
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider m-0 mb-3 pb-2 border-b border-slate-100">
            Menú Principal
          </h2>

          <ul className="list-none p-0 m-0 flex flex-row md:flex-col gap-2.5">
            <li className="flex-1 md:flex-initial">
              <NavLink
                to={rutaInicio}
                end
                className={({ isActive }) =>
                  `flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 no-underline border-2 ${
                    isActive
                      ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'border-slate-200 bg-slate-50/80 text-slate-700 hover:border-blue-300 hover:bg-blue-50/70 hover:text-blue-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <svg
                      width="20"
                      height="20"
                      className={`w-5 h-5 flex-shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-500'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <span>Inicio</span>
                  </>
                )}
              </NavLink>
            </li>
            <li className="flex-1 md:flex-initial">
              <NavLink
                to={rutaDestinos}
                className={({ isActive }) =>
                  `flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 no-underline border-2 ${
                    isActive
                      ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'border-slate-200 bg-slate-50/80 text-slate-700 hover:border-blue-300 hover:bg-blue-50/70 hover:text-blue-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <svg
                      width="20"
                      height="20"
                      className={`w-5 h-5 flex-shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-500'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Destinos</span>
                  </>
                )}
              </NavLink>
            </li>
          </ul>

          {/* Guía de viaje para el usuario en pantallas medianas y grandes */}
          <div className="hidden md:block mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-700 m-0 mb-1">
              Asesoría al Viajero
            </p>
            <p className="text-xs text-slate-500 leading-relaxed m-0">
              Selecciona un destino de nuestro catálogo para revisar itinerarios aéreos, tarifas por noche y disponibilidad actualizada.
            </p>
          </div>
        </nav>

        {/* Área de contenido para las páginas */}
        <main className="flex-1 w-full min-w-0" id="contenido-principal">
          <Routes>
            {/* Portada institucional */}
            <Route path="/" element={<Inicio />} />

            {/* Catálogo de destinos (consulta los datos únicamente al montar esta vista) */}
            <Route path="/destinos" element={<Destinos />} />

            {/* Detalle de vuelos y hoteles del destino seleccionado */}
            <Route path="/destinos/:id" element={<DetalleDestino />} />
            <Route path="/destino/:id" element={<DetalleDestino />} />

            {/* Ruta comodín para páginas inexistentes (404) */}
            <Route path="*" element={<PaginaNoEncontrada />} />
          </Routes>
        </main>
      </div>

      {/* Pie de página institucional */}
      <footer className="text-center py-6 bg-white border-t border-slate-200 text-slate-500 text-xs mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="m-0 font-medium text-slate-600">
            Agencia de Viajes Global — Planificación de Vuelos y Hoteles
          </p>
          <p className="m-0">
            © 2026 Agencia de Viajes Global · Todos los derechos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}
