import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';
import Destinos from './Destinos';
import DetalleViaje from './DetalleViaje';
import './App.css';

// ---------------------------------------------------------------------------
// Componente principal: Configura el enrutador y la estructura de navegación.
// Modulariza las vistas importando el componente REST (Destinos)
// y el componente GraphQL (DetalleViaje) desde archivos independientes.
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
          {/* Menú de navegación lateral */}
          <nav className="side-menu" aria-label="Menú principal">
            <h2>Navegación</h2>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/destinos">Destinos</Link></li>
            </ul>
          </nav>

          {/* Enrutamiento hacia las vistas modulares */}
          <main className="main-content">
            <Routes>
              {/* Portada de bienvenida */}
              <Route path="/" element={<Inicio />} />

              {/* Vista REST: Catálogo de destinos */}
              <Route path="/destinos" element={<Destinos />} />

              {/* Vista GraphQL: Detalle parametrizado de vuelos y hoteles */}
              <Route path="/destino/:destino" element={<DetalleViaje />} />

              {/* Ruta comodín para páginas inexistentes */}
              <Route path="*" element={<NoEncontrado />} />
            </Routes>
          </main>
        </div>

        {/* Pie de página */}
        <footer>
          <p>© 2026 Agencia de Viajes Global. Todos los derechos reservados.</p>
        </footer>
      </div>
    </Router>
  );
}

// ---------------------------------------------------------------------------
// Vista de Inicio: Mensaje de bienvenida y acceso rápido al catálogo.
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
// Vista 404: Se muestra cuando la ruta no coincide con ninguna ruta válida.
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
