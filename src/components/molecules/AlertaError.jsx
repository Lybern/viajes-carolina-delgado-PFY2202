import React from 'react';
import { Link } from 'react-router';
import Boton from '../atoms/Boton';

// ---------------------------------------------------------------------------
// Molécula: Mensaje de error accesible (role="alert") con acciones de recuperación.
// ---------------------------------------------------------------------------
export default function AlertaError({
  mensaje = 'Ha ocurrido un error inesperado.',
  onReintentar = null,
  disabledReintento = false,
  mostrarVolver = false,
}) {
  return (
    <div
      className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm"
      role="alert"
    >
      <p className="font-medium mb-3">
        <strong>Error:</strong> {mensaje}
      </p>

      <div className="flex items-center gap-3 flex-wrap">
        {onReintentar && (
          <Boton
            variant="danger"
            onClick={onReintentar}
            disabled={disabledReintento}
          >
            Reintentar
          </Boton>
        )}

        {mostrarVolver && (
          <Link
            to="/destinos"
            className="inline-flex items-center justify-center font-semibold rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-4 py-2 text-sm transition-all duration-200"
          >
            Volver al catálogo
          </Link>
        )}
      </div>
    </div>
  );
}
