import React from 'react';

// ---------------------------------------------------------------------------
// Átomo: Campo de entrada de texto reutilizable.
// ---------------------------------------------------------------------------
export default function CampoTexto({
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  ariaLabel,
}) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      aria-label={ariaLabel}
      className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all duration-200 ${className}`}
    />
  );
}
