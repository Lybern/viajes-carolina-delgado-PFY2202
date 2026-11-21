import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';

// ---------------------------------------------------------------------------
// Vista Destinos: Catálogo REST según el diseño de la sesión del docente.
// Recibe como props los datos, estados y la función de carga desde App.
// Incluye botones de prueba para simular códigos HTTP 404 y 500 en vivo,
// además de buscador por texto y filtros por país para una experiencia óptima.
// ---------------------------------------------------------------------------
export default function Destinos({
  destinos = [],
  cargando,
  error,
  cargarDestinos,
}) {
  const [busqueda, setBusqueda] = useState('');
  const [paisSeleccionado, setPaisSeleccionado] = useState('Todos');

  // Lista única de países para los filtros
  const paisesDisponibles = useMemo(() => {
    const setPaises = new Set(destinos.map((d) => d.pais).filter(Boolean));
    return Array.from(setPaises);
  }, [destinos]);

  // Filtrado reactivo de destinos por término de búsqueda y país
  const destinosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return destinos.filter((destino) => {
      const coincidePais =
        paisSeleccionado === 'Todos' || destino.pais === paisSeleccionado;
      const coincideTexto =
        !termino ||
        destino.nombre.toLowerCase().includes(termino) ||
        destino.actividades.toLowerCase().includes(termino);

      return coincidePais && coincideTexto;
    });
  }, [destinos, busqueda, paisSeleccionado]);

  return (
    <section className="destinos-vista">
      <h1>Destinos turísticos</h1>
      <p>Los destinos se consultan mediante una petición al servicio REST.</p>

      {/* Botones de simulación idénticos a los del docente en sesion_semana5 */}
      <div className="acciones">
        <button
          type="button"
          onClick={() => cargarDestinos()}
          disabled={cargando}
        >
          Actualizar destinos
        </button>

        <button
          type="button"
          onClick={() => cargarDestinos('404')}
          disabled={cargando}
        >
          Simular error 404
        </button>

        <button
          type="button"
          onClick={() => cargarDestinos('500')}
          disabled={cargando}
        >
          Simular error 500
        </button>
      </div>

      {/* Indicador de carga accesible */}
      {cargando && (
        <div className="mensaje-estado" role="status">
          <div className="spinner"></div>
          <p>Cargando destinos...</p>
        </div>
      )}

      {/* Manejo de error accesible con botón de reintento */}
      {error && (
        <div className="mensaje-error" role="alert">
          <p><strong>Error:</strong> {error}</p>
          <button
            type="button"
            onClick={() => cargarDestinos()}
            disabled={cargando}
            className="btn-reintentar"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Sin destinos */}
      {!cargando && !error && destinos.length === 0 && (
        <p className="mensaje-vacio">No hay destinos disponibles por el momento.</p>
      )}

      {/* Buscador interactivo y filtros cuando hay datos */}
      {!cargando && !error && destinos.length > 0 && (
        <>
          <div className="barra-busqueda-contenedor">
            <div className="barra-busqueda-principal">
              <input
                type="search"
                placeholder="🔍 Buscar por nombre o actividad (ej. Louvre, playa, templo)..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="input-busqueda"
              />
              {busqueda && (
                <button
                  type="button"
                  onClick={() => setBusqueda('')}
                  className="btn-limpiar"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="filtros-paises">
              <span className="filtro-etiqueta">País:</span>
              <button
                type="button"
                onClick={() => setPaisSeleccionado('Todos')}
                className={`chip-filtro ${paisSeleccionado === 'Todos' ? 'activo' : ''}`}
              >
                Todos
              </button>
              {paisesDisponibles.map((pais) => (
                <button
                  key={pais}
                  type="button"
                  onClick={() => setPaisSeleccionado(pais)}
                  className={`chip-filtro ${paisSeleccionado === pais ? 'activo' : ''}`}
                >
                  {pais}
                </button>
              ))}
            </div>
          </div>

          {/* Cuadrícula de tarjetas de destinos */}
          <div className="grid-destinos">
            {destinosFiltrados.map((destino) => (
              <article className="card-destino" key={destino.id}>
                <h2>{destino.nombre}</h2>
                <p className="pais">📍 País: <strong>{destino.pais}</strong></p>
                <p className="actividades">🎯 <strong>Actividades:</strong> {destino.actividades}</p>
                <Link to={`/destinos/${destino.id}`} className="btn-detalle">
                  Ver detalle →
                </Link>
              </article>
            ))}
          </div>

          {destinosFiltrados.length === 0 && (
            <div className="sin-resultados">
              <p>🔍 No se encontraron destinos con esos criterios.</p>
              <button
                type="button"
                onClick={() => {
                  setBusqueda('');
                  setPaisSeleccionado('Todos');
                }}
                className="btn-secundario"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
