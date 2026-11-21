import React from 'react';
import Spinner from '../atoms/Spinner';

// ---------------------------------------------------------------------------
// Molécula: Estado visual de carga accesible (role="status", aria-live="polite").
// ---------------------------------------------------------------------------
export default function EstadoCarga({ mensaje = 'Cargando información...' }) {
  return (
    <div
      className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm font-medium"
      role="status"
      aria-live="polite"
    >
      <Spinner className="w-5 h-5 text-blue-600 flex-shrink-0" />
      <p className="m-0">{mensaje}</p>
    </div>
  );
}
