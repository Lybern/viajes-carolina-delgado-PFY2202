import React from 'react';
import { Link } from 'react-router';
import Boton from '../atoms/Boton';

// ---------------------------------------------------------------------------
// Molécula: Mensaje de error accesible (role="alert") con acciones de recuperación.
// Diferencia errores 404 (recurso inexistente, sin botón de recargar/reintentar)
// de errores 500 o fallos de servidor/red (que sí permiten reintentar la petición).
// ---------------------------------------------------------------------------
export default function AlertaError({
  mensaje = 'Ha ocurrido un error inesperado.',
  codigo = null,
  onReintentar = null,
  onRestablecer = null,
  disabledReintento = false,
  mostrarVolver = false,
}) {
  const esNoEncontrado = codigo === 404;

  return (
    <div
      className={`p-5 rounded-2xl border text-sm shadow-sm ${
        esNoEncontrado
          ? 'bg-amber-50 border-amber-200 text-amber-900'
          : 'bg-red-50 border-red-200 text-red-900'
      }`}
      role="alert"
    >
      <div className="flex flex-col gap-2">
        <p className="font-bold m-0">
          {esNoEncontrado
            ? 'Recurso no disponible (404)'
            : 'Contingencia en la comunicación con el servicio'}
        </p>
        <p className="m-0 mb-2 leading-relaxed">{mensaje}</p>

        <div className="flex items-center gap-3 flex-wrap">
          {onReintentar && (
            <Boton
              variant="danger"
              onClick={onReintentar}
              disabled={disabledReintento}
            >
              Reintentar consulta
            </Boton>
          )}

          {onRestablecer && (
            <Boton
              variant="secondary"
              onClick={onRestablecer}
              disabled={disabledReintento}
            >
              Volver al listado general
            </Boton>
          )}

          {mostrarVolver && (
            <Link
              to="/destinos"
              className="inline-flex items-center justify-center font-semibold rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-4 py-2 text-sm transition-all duration-200 no-underline shadow-sm"
            >
              Volver al catálogo
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
