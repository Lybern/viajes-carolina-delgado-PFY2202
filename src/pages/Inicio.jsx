import React from 'react';
import { Link } from 'react-router';

// ---------------------------------------------------------------------------
// Vista Inicio: Portada institucional y punto de entrada al sistema.
// Ofrece una navegación limpia sin precargas innecesarias de datos.
// ---------------------------------------------------------------------------
export default function Inicio() {
  return (
    <section className="inicio-vista">
      <div className="hero-banner">
        <h2>Bienvenido a Agencia de Viajes Global</h2>
        <p className="hero-subtitulo">
          Tu plataforma integral para descubrir destinos inolvidables,
          itinerarios de vuelo y las mejores opciones de alojamiento.
        </p>

        <div className="hero-acciones">
          <Link to="/destinos" className="btn-primario-grande">
            Explorar Catálogo de Destinos →
          </Link>
        </div>
      </div>

      <div className="caracteristicas-grid">
        <div className="caracteristica-card">
          <span className="caracteristica-icono">🌍</span>
          <h3>Catálogo REST</h3>
          <p>
            Consulta información actualizada de países y sus actividades
            turísticas más destacadas.
          </p>
        </div>

        <div className="caracteristica-card">
          <span className="caracteristica-icono">⚡</span>
          <h3>Consultas GraphQL</h3>
          <p>
            Obtén detalles en tiempo real sobre vuelos, disponibilidad de asientos
            y tarifas de hoteles para cada destino.
          </p>
        </div>

        <div className="caracteristica-card">
          <span className="caracteristica-icono">🛡️</span>
          <h3>Resiliencia y Conectividad</h3>
          <p>
            Diseñado para gestionar contingencias con alertas accesibles y
            reintentos directos sin recargar el navegador.
          </p>
        </div>
      </div>
    </section>
  );
}
