import React from 'react';
import { Routes, Route, NavLink, Link } from 'react-router';
import Inicio from './pages/Inicio';
import Destinos from './pages/Destinos';
import DetalleDestino from './pages/DetalleDestino';
import PaginaNoEncontrada from './pages/PaginaNoEncontrada';
import './App.css';

// ---------------------------------------------------------------------------
// Componente principal: Configura la estructura de navegación y las rutas.
// El BrowserRouter global está provisto en src/main.jsx según la arquitectura
// de la clase del docente.
// ---------------------------------------------------------------------------
function App() {
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
          {/* Menú de navegación accesible con NavLink */}
          <nav className="side-menu" aria-label="Menú principal">
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

          {/* Enrutamiento hacia las vistas modulares en src/pages/ */}
          <main className="main-content" id="contenido-principal">
            <Routes>
              {/* Portada institucional */}
              <Route path="/" element={<Inicio />} />

              {/* Catálogo REST de destinos */}
              <Route path="/destinos" element={<Destinos />} />

              {/* Detalle GraphQL de vuelos y hoteles para el destino seleccionado */}
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

export default App;
