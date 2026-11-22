import React from 'react';

// ---------------------------------------------------------------------------
// Átomo: Botón reutilizable con soporte de variantes visuales y estados.
// ---------------------------------------------------------------------------
export default function Boton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  ariaLabel,
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary:
      'bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-4 py-2 text-sm focus:ring-blue-500',
    secondary:
      'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3.5 py-2 text-xs sm:text-sm focus:ring-slate-400 shadow-sm',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-sm px-4 py-2 text-sm focus:ring-red-500',
    simulation:
      'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 text-xs focus:ring-rose-400',
    simulationActive:
      'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1.5 text-xs focus:ring-emerald-400',
    chip:
      'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-3 py-1 text-xs rounded-full focus:ring-slate-400',
    chipActive:
      'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 px-3 py-1 text-xs rounded-full shadow-sm focus:ring-blue-500',
  };

  const selectedVariant = variantClasses[variant] || variantClasses.primary;
  const disabledClasses = disabled
    ? 'opacity-60 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${baseClasses} ${selectedVariant} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
}
