import React from 'react';
import { Link, useSearchParams } from 'react-router';

// ---------------------------------------------------------------------------
// Tarjetas informativas de la portada con fotografía e identificador visual.
// ---------------------------------------------------------------------------
const serviciosDestacados = [
  {
    numero: '01',
    etiqueta: 'Catálogo Mundial',
    titulo: 'Destinos y Experiencias',
    descripcion:
      'Conoce ciudades emblemáticas de Europa, Asia y América, su mejor temporada climática y las actividades imperdibles en cada país.',
    imagen:
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
    alt: 'Paisaje escénico de viaje entre montañas y lago',
  },
  {
    numero: '02',
    etiqueta: 'Conectividad Aérea',
    titulo: 'Vuelos e Itinerarios',
    descripcion:
      'Compara aerolíneas internacionales, rutas desde Santiago, horarios de salida, fechas programadas y cupos de asientos disponibles.',
    imagen:
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
    alt: 'Vista desde el ala de un avión comercial sobre las nubes',
  },
  {
    numero: '03',
    etiqueta: 'Estadías Confortables',
    titulo: 'Alojamientos Exclusivos',
    descripcion:
      'Revisa opciones de hospedaje categorizadas por estrellas, ubicación estratégica, servicios incluidos y disponibilidad de habitaciones.',
    imagen:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    alt: 'Hotel resort de lujo con piscina iluminada al atardecer',
  },
];

// ---------------------------------------------------------------------------
// Página: Portada institucional y bienvenida para el usuario final.
// No realiza descargas anticipadas del catálogo; presenta los servicios
// de la agencia de viajes y guía al usuario hacia el catálogo de destinos.
// ---------------------------------------------------------------------------
export default function Inicio() {
  const [searchParams] = useSearchParams();
  const modoDebug = searchParams.get('debug') === 'true';
  const rutaDestinos = modoDebug ? '/destinos?debug=true' : '/destinos';

  return (
    <section className="flex flex-col gap-6">
      {/* Hero Banner con imagen panorámica de fondo, gradiente profundo y llamada a la acción */}
      <div className="relative overflow-hidden bg-slate-900 text-white p-8 sm:p-10 rounded-2xl shadow-lg border border-blue-800/40">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1400&q=80"
          alt="Ruta panorámica de viajes internacionales"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 opacity-85" />

        <div className="relative z-10 max-w-2xl">
          <span className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            Planificador de Viajes Internacionales
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white m-0 mb-4 leading-tight">
            Descubre tu próximo destino con vuelos y hoteles a medida
          </h2>
          <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed m-0 mb-6">
            Explora nuestro catálogo mundial de destinos turísticos, conoce sus
            actividades más emblemáticas y consulta la disponibilidad de vuelos
            y alojamientos para armar tu itinerario ideal.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to={rutaDestinos}
              className="inline-flex items-center justify-center font-bold rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 px-6 py-3 text-sm sm:text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 no-underline"
            >
              Explorar Catálogo de Destinos
            </Link>
          </div>

          {/* Indicadores de la agencia orientados al viajero */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/15">
            <div>
              <span className="block text-xl sm:text-2xl font-black text-amber-300">
                5+
              </span>
              <span className="text-xs text-blue-200">
                Destinos internacionales
              </span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-black text-emerald-300">
                10+
              </span>
              <span className="text-xs text-blue-200">
                Rutas aéreas disponibles
              </span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-black text-sky-300">
                100%
              </span>
              <span className="text-xs text-blue-200">
                Hoteles seleccionados
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de tarjetas con imágenes en 3 cortes (1 col móvil, 2 cols tablet, 3 cols desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {serviciosDestacados.map((servicio, index) => (
          <article
            key={servicio.numero}
            className={`group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col ${
              index === 2 ? 'md:col-span-2 lg:col-span-1' : ''
            }`}
          >
            {/* Cabecera fotográfica de la tarjeta */}
            <div className="relative h-44 bg-slate-900 overflow-hidden">
              <img
                src={servicio.imagen}
                alt={servicio.alt}
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />

              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                <span className="bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                  {servicio.etiqueta}
                </span>
                <span className="bg-blue-600/95 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
                  {servicio.numero}
                </span>
              </div>
            </div>

            {/* Contenido descriptivo */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800 m-0 mb-2">
                  {servicio.titulo}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed m-0">
                  {servicio.descripcion}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
