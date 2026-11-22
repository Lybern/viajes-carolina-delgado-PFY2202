import { http, graphql, HttpResponse, delay } from 'msw';
import { GRAPHQL_ENDPOINT, REST_DESTINOS_ENDPOINT } from '../graphql/endpoint';

// Instancia de GraphQL vinculada al endpoint dinámico (local y GitHub Pages)
const apiGraphql = graphql.link(GRAPHQL_ENDPOINT);

// Control de latencia simulada: más ágil en consultas exitosas repetidas
const consultasExitosas = new Set();

function calcularRetraso(clave, msInicial = 450, msRepetida = 150) {
  if (consultasExitosas.has(clave)) {
    return msRepetida;
  }
  consultasExitosas.add(clave);
  return msInicial;
}

// ---------------------------------------------------------------------------
// Fuente única de datos base de Destinos (compartida entre REST y GraphQL
// para evitar duplicidad de metadatos como país, descripción o actividades)
// ---------------------------------------------------------------------------
const destinos = [
  {
    id: 'Paris',
    nombre: 'París',
    pais: 'Francia',
    descripcion: 'La Ciudad de la Luz cautiva con su arquitectura histórica, museos de clase mundial y paseos junto al río Sena.',
    temporada: 'Abril a octubre (Primavera - Otoño)',
    precioDesde: '$1.090 USD',
    imagen: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80',
    actividades: 'Torre Eiffel, Museo del Louvre, Crucero por el Sena, Barrio de Montmartre',
  },
  {
    id: 'Tokio',
    nombre: 'Tokio',
    pais: 'Japón',
    descripcion: 'Metrópolis fascinante donde conviven santuarios milenarios, jardines imperiales y distritos tecnológicos.',
    temporada: 'Marzo a mayo (cerezos) y octubre a noviembre',
    precioDesde: '$1.490 USD',
    imagen: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=900&q=80',
    actividades: 'Templo Senso-ji, Cruce de Shibuya, Excursión al Monte Fuji, Gastronomía en Shinjuku',
  },
  {
    id: 'Cancun',
    nombre: 'Cancún',
    pais: 'México',
    descripcion: 'Paraíso del Caribe mexicano con playas de arena blanca, aguas turquesas, arrecifes coralinos y cultura maya.',
    temporada: 'Noviembre a mayo (Clima tropical seco)',
    precioDesde: '$650 USD',
    imagen: 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?auto=format&fit=crop&w=900&q=80',
    actividades: 'Chichén Itzá, Snorkel en arrecifes, Nado en cenotes sagrados, Isla Mujeres',
  },
  {
    id: 'Cusco',
    nombre: 'Cusco',
    pais: 'Perú',
    descripcion: 'Antigua capital del Imperio Inca en el corazón de los Andes, puerta de entrada al Valle Sagrado y Machu Picchu.',
    temporada: 'Abril a octubre (Temporada seca andina)',
    precioDesde: '$360 USD',
    imagen: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=900&q=80',
    actividades: 'Ciudadela de Machu Picchu, Valle Sagrado, Plaza de Armas, Fortaleza de Sacsayhuamán',
  },
  {
    id: 'Roma',
    nombre: 'Roma',
    pais: 'Italia',
    descripcion: 'La Ciudad Eterna ofrece más de dos milenios de arte, plazas barrocas, ruinas imperiales y gastronomía mediterránea.',
    temporada: 'Abril a junio y septiembre a octubre',
    precioDesde: '$1.040 USD',
    imagen: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80',
    actividades: 'Coliseo Romano, Fontana di Trevi, Museos Vaticanos, Piazza Navona',
  },
];

// ---------------------------------------------------------------------------
// Opciones detalladas de Vuelos y Hoteles por destino para GraphQL
// ---------------------------------------------------------------------------
const itinerariosPorDestino = {
  Paris: {
    vuelos: [
      {
        id: 'AF-401',
        aerolinea: 'Air France',
        origen: 'Santiago (SCL) → París (CDG)',
        horario: 'Salida 14:20 · Llegada 10:55 (+1) · Directo',
        fechas: '10 Dic - 20 Dic 2026',
        precio: '$1.250 USD',
        disponibilidad: '8 asientos disponibles',
      },
      {
        id: 'IB-6830',
        aerolinea: 'Iberia',
        origen: 'Santiago (SCL) → París (ORY)',
        horario: 'Salida 12:40 · Llegada 11:30 (+1) · 1 escala en Madrid',
        fechas: '15 Dic - 25 Dic 2026',
        precio: '$1.090 USD',
        disponibilidad: 'Últimos 4 asientos',
      },
    ],
    hoteles: [
      {
        id: 'HT-PAR-1',
        nombre: 'Hôtel Le Marais Opéra',
        categoria: '4 Estrellas Superior',
        ubicacion: 'Distrito Le Marais, Centro Histórico de París',
        fechas: '10 Dic - 20 Dic 2026',
        precio: '$180 USD / noche',
        disponibilidad: '5 habitaciones disponibles',
        servicios: 'Desayuno francés incluido, Wi-Fi alta velocidad y recepción 24h',
      },
      {
        id: 'HT-PAR-2',
        nombre: 'Eiffel View Luxury Suite',
        categoria: '5 Estrellas Gran Lujo',
        ubicacion: 'Avenue de Suffren, a pasos de la Torre Eiffel',
        fechas: '15 Dic - 25 Dic 2026',
        precio: '$320 USD / noche',
        disponibilidad: 'Últimas 2 habitaciones',
        servicios: 'Terraza con vista a la Torre Eiffel, spa, desayuno gourmet y traslado VIP',
      },
    ],
  },
  Tokio: {
    vuelos: [
      {
        id: 'NH-204',
        aerolinea: 'All Nippon Airways (ANA)',
        origen: 'Santiago (SCL) → Tokio (HND)',
        horario: 'Salida 21:15 · Llegada 15:40 (+2) · 1 escala',
        fechas: '05 Ene - 18 Ene 2027',
        precio: '$1.680 USD',
        disponibilidad: '6 asientos disponibles',
      },
      {
        id: 'UA-847',
        aerolinea: 'United Airlines',
        origen: 'Santiago (SCL) → Tokio (NRT)',
        horario: 'Salida 22:30 · Llegada 16:25 (+2) · 1 escala en Houston',
        fechas: '10 Ene - 23 Ene 2027',
        precio: '$1.490 USD',
        disponibilidad: '10 asientos disponibles',
      },
    ],
    hoteles: [
      {
        id: 'HT-TOK-1',
        nombre: 'Shinjuku Granbell Hotel',
        categoria: '4 Estrellas Boutique',
        ubicacion: 'Kabukicho, Shinjuku (A 4 min de estación Shinjuku)',
        fechas: '05 Ene - 18 Ene 2027',
        precio: '$160 USD / noche',
        disponibilidad: '7 habitaciones disponibles',
        servicios: 'Rooftop bar panorámico, desayuno japonés/occidental y Wi-Fi portátil',
      },
      {
        id: 'HT-TOK-2',
        nombre: 'The Capitol Hotel Tokyu',
        categoria: '5 Estrellas Luxury',
        ubicacion: 'Nagatacho, Chiyoda (Junto al Palacio Imperial)',
        fechas: '10 Ene - 23 Ene 2027',
        precio: '$350 USD / noche',
        disponibilidad: '3 habitaciones disponibles',
        servicios: 'Onsen termal privado, piscina climatizada, desayuno y conexión directa al metro',
      },
    ],
  },
  Cancun: {
    vuelos: [
      {
        id: 'LA-620',
        aerolinea: 'LATAM Airlines',
        origen: 'Santiago (SCL) → Cancún (CUN)',
        horario: 'Salida 08:10 · Llegada 14:55 · Directo',
        fechas: '01 Feb - 08 Feb 2027',
        precio: '$720 USD',
        disponibilidad: '12 asientos disponibles',
      },
      {
        id: 'CM-174',
        aerolinea: 'Copa Airlines',
        origen: 'Santiago (SCL) → Cancún (CUN)',
        horario: 'Salida 03:45 · Llegada 12:30 · 1 escala en Panamá',
        fechas: '05 Feb - 12 Feb 2027',
        precio: '$650 USD',
        disponibilidad: '9 asientos disponibles',
      },
    ],
    hoteles: [
      {
        id: 'HT-CUN-1',
        nombre: 'Resort Riviera Maya All-Inclusive',
        categoria: '5 Estrellas Todo Incluido',
        ubicacion: 'Blvd. Kukulcán Km 14.5, Zona Hotelera Frente al Mar',
        fechas: '01 Feb - 08 Feb 2027',
        precio: '$260 USD / noche',
        disponibilidad: '8 habitaciones disponibles',
        servicios: 'All-Inclusive 24h, playa privada, 6 restaurantes y deportes acuáticos',
      },
      {
        id: 'HT-CUN-2',
        nombre: 'Hotel Boutique Playa Linda',
        categoria: '4 Estrellas',
        ubicacion: 'Punta Cancún, acceso directo a Playa Tortugas',
        fechas: '05 Feb - 12 Feb 2027',
        precio: '$110 USD / noche',
        disponibilidad: '11 habitaciones disponibles',
        servicios: 'Desayuno buffet caribeño, piscina frente al mar y club de playa',
      },
    ],
  },
  Cusco: {
    vuelos: [
      {
        id: 'LA-2364',
        aerolinea: 'LATAM Airlines',
        origen: 'Santiago (SCL) → Cusco (CUZ)',
        horario: 'Salida 07:15 · Llegada 10:05 · Directo',
        fechas: '12 Mar - 18 Mar 2027',
        precio: '$420 USD',
        disponibilidad: '15 asientos disponibles',
      },
      {
        id: 'H2-502',
        aerolinea: 'SKY Airline',
        origen: 'Santiago (SCL) → Cusco (CUZ)',
        horario: 'Salida 13:20 · Llegada 18:10 · 1 escala en Lima',
        fechas: '15 Mar - 21 Mar 2027',
        precio: '$360 USD',
        disponibilidad: '7 asientos disponibles',
      },
    ],
    hoteles: [
      {
        id: 'HT-CUS-1',
        nombre: 'Palacio del Inka Luxury Collection',
        categoria: '5 Estrellas Histórico',
        ubicacion: 'Plazoleta Santo Domingo 259, Centro Histórico',
        fechas: '12 Mar - 18 Mar 2027',
        precio: '$230 USD / noche',
        disponibilidad: '5 habitaciones disponibles',
        servicios: 'Desayuno buffet andino, sistema de oxigenación y spa termal',
      },
      {
        id: 'HT-CUS-2',
        nombre: 'Tierra Viva Cusco San Blas',
        categoria: '3 Estrellas Superior',
        ubicacion: 'Barrio de San Blas, a 3 cuadras de la Plaza de Armas',
        fechas: '15 Mar - 21 Mar 2027',
        precio: '$85 USD / noche',
        disponibilidad: '9 habitaciones disponibles',
        servicios: 'Desayuno incluido, infusiones de hoja de coca de cortesía y patio colonial',
      },
    ],
  },
  Roma: {
    vuelos: [
      {
        id: 'AZ-689',
        aerolinea: 'ITA Airways',
        origen: 'Santiago (SCL) → Roma (FCO)',
        horario: 'Salida 15:10 · Llegada 13:20 (+1) · 1 escala',
        fechas: '02 Abr - 14 Abr 2027',
        precio: '$1.180 USD',
        disponibilidad: '5 asientos disponibles',
      },
      {
        id: 'UX-042',
        aerolinea: 'Air Europa',
        origen: 'Santiago (SCL) → Roma (FCO)',
        horario: 'Salida 17:00 · Llegada 16:05 (+1) · 1 escala en Madrid',
        fechas: '08 Abr - 20 Abr 2027',
        precio: '$1.040 USD',
        disponibilidad: '7 asientos disponibles',
      },
    ],
    hoteles: [
      {
        id: 'HT-ROM-1',
        nombre: 'Hotel Colosseo Imperial',
        categoria: '4 Estrellas',
        ubicacion: 'Via Cavour, Rione Monti (A 300m del Coliseo)',
        fechas: '02 Abr - 14 Abr 2027',
        precio: '$175 USD / noche',
        disponibilidad: '6 habitaciones disponibles',
        servicios: 'Desayuno italiano en terraza panorámica y Wi-Fi gratuito',
      },
      {
        id: 'HT-ROM-2',
        nombre: 'Trevi Palace Luxury Inn',
        categoria: '4 Estrellas Boutique',
        ubicacion: 'Via del Lavatore, junto a la Fontana di Trevi',
        fechas: '08 Abr - 20 Abr 2027',
        precio: '$210 USD / noche',
        disponibilidad: 'Últimas 3 habitaciones',
        servicios: 'Suites insonorizadas, desayuno continental y conserjería artística',
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Interceptores combinados REST y GraphQL
// ---------------------------------------------------------------------------
const manejarRestDestinos = async ({ request }) => {
  const url = new URL(request.url);
  const error =
    url.searchParams.get('error') ||
    (url.searchParams.get('simularError') === 'true' ? '500' : null);

  await delay(
    error ? 450 : calcularRetraso('rest-destinos', 450, 150)
  );

  if (error === '404') {
    return HttpResponse.json(
      {
        mensaje:
          'No se encontró el catálogo de destinos solicitado (404).',
      },
      { status: 404 }
    );
  }

  if (error === '500') {
    return HttpResponse.json(
      {
        mensaje:
          'El servidor experimentó un fallo interno al procesar el catálogo de destinos (500).',
      },
      { status: 500 }
    );
  }

  return HttpResponse.json(destinos, { status: 200 });
};

export const handlers = [
  // 1. Interceptor REST: soporta tanto la ruta relativa de BASE_URL como cualquier subruta
  http.get(REST_DESTINOS_ENDPOINT, manejarRestDestinos),
  http.get('*/api/destinos', manejarRestDestinos),

  // 2. Interceptor GraphQL: ObtenerDetalleDestino
  apiGraphql.query('ObtenerDetalleDestino', async ({ variables }) => {
    const { id, destino, simularError } = variables || {};
    const destinoId = id || destino;

    await delay(
      simularError
        ? 450
        : calcularRetraso(`gql-destino-${destinoId}`, 450, 150)
    );

    // En GraphQL los errores de ejecución devuelven estado HTTP 200 OK con el arreglo "errors"
    if (simularError) {
      return HttpResponse.json({
        errors: [
          {
            message:
              'No fue posible obtener los vuelos y hoteles del destino seleccionado.',
            extensions: { code: 'ERROR_SIMULADO' },
          },
        ],
      });
    }

    // Búsqueda de destino base por ID (insensible a mayúsculas) y unión con sus vuelos y hoteles
    const destinoBase = destinos.find(
      (d) => d.id.toLowerCase() === (destinoId || '').toLowerCase()
    );
    const itinerario = destinoBase ? itinerariosPorDestino[destinoBase.id] : null;
    const detalle =
      destinoBase && itinerario
        ? { ...destinoBase, ...itinerario }
        : null;

    return HttpResponse.json({
      data: {
        destino: detalle,
      },
    });
  }),
];
