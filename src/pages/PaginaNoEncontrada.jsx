import React from 'react';
import { Link } from 'react-router';

// ---------------------------------------------------------------------------
// Vista PaginaNoEncontrada: Maneja rutas no definidas en el enrutador (404).
// ---------------------------------------------------------------------------
export default function PaginaNoEncontrada() {
  return (
    <section className="no-encontrado-vista">
      <div className="no-encontrado-contenido">
        <span className="error-codigo">404</span>
        <h2>Página no encontrada</h2>
        <p>
          La ruta a la que intentas acceder no existe o fue movida dentro del sistema.
        </p>

        <div className="acciones-no-encontrado">
          <Link to="/" className="btn-secundario">
            🏠 Ir al Inicio
          </Link>
          <Link to="/destinos" className="btn-primario">
            📍 Ver Catálogo de Destinos
          </Link>
        </div>
      </div>
    </section>
  );
}
