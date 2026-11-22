import React from 'react';
import { Routes, Route, NavLink, Link } from 'react-router';
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
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800 antialiased">
      {/* Cabecera institucional con gradiente y adaptabilidad móvil/desktop */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-800 text-white shadow-md border-b border-blue-900/40">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between flex-wrap gap-4">
          <Link to="/" className="flex items-center gap-3.5 no-underline text-white group">
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
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
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
          <ul className="list-none p-0 m-0 flex flex-row md:flex-col gap-2">
            <li className="flex-1 md:flex-initial">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex items-center justify-center md:justify-start gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 no-underline ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <span>Inicio</span>
              </NavLink>
            </li>
            <li className="flex-1 md:flex-initial">
              <NavLink
                to="/destinos"
                className={({ isActive }) =>
                  `flex items-center justify-center md:justify-start gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 no-underline ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <span>Destinos</span>
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
