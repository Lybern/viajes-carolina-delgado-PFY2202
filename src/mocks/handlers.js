import { http, graphql, HttpResponse, delay } from 'msw';
import { GRAPHQL_ENDPOINT } from '../graphql/endpoint';

// Instancia de GraphQL vinculada al endpoint dinámico configurado por el docente
const apiGraphql = graphql.link(GRAPHQL_ENDPOINT);

// ---------------------------------------------------------------------------
// Datos simulados de Destinos para la API REST
// ---------------------------------------------------------------------------
const destinos = [
  {
    id: 'Paris',
    nombre: 'París',
    pais: 'Francia',
    actividades: 'Torre Eiffel, Museo del Louvre, Crucero por el Sena',
  },
  {
    id: 'Tokio',
    nombre: 'Tokio',
    pais: 'Japón',
    actividades: 'Templo Senso-ji, Cruce de Shibuya, Excursión al Monte Fuji',
  },
  {
    id: 'Cancun',
    nombre: 'Cancún',
    pais: 'México',
    actividades: 'Chichén Itzá, Snorkel en arrecifes, Nado en cenotes',
  },
  {
    id: 'Cusco',
    nombre: 'Cusco',
    pais: 'Perú',
    actividades: 'Ciudadela de Machu Picchu, Valle Sagrado, Plaza de Armas',
  },
  {
    id: 'Roma',
    nombre: 'Roma',
    pais: 'Italia',
    actividades: 'Coliseo Romano, Fontana di Trevi, Museos Vaticanos',
  },
];

// ---------------------------------------------------------------------------
// Opciones detalladas de Vuelos y Hoteles por cada destino para GraphQL
// ---------------------------------------------------------------------------
const detallesPorDestino = {
  'Paris': {
    id: 'Paris',
    nombre: 'París',
    pais: 'Francia',
    vuelos: [
      { aerolinea: 'Air France', fechas: '10 Dic - 20 Dic 2026', precio: '$1.250 USD', disponibilidad: '8 asientos disponibles' },
      { aerolinea: 'Iberia', fechas: '15 Dic - 25 Dic 2026', precio: '$1.090 USD', disponibilidad: '4 asientos disponibles' },
    ],
    hoteles: [
      { nombre: 'Hôtel Le Marais Opéra', fechas: '10 Dic - 20 Dic 2026', precio: '$180 USD / noche', disponibilidad: '5 habitaciones disponibles' },
      { nombre: 'Eiffel View Suite', fechas: '15 Dic - 25 Dic 2026', precio: '$320 USD / noche', disponibilidad: '2 habitaciones disponibles' },
    ],
  },
  'Tokio': {
    id: 'Tokio',
    nombre: 'Tokio',
    pais: 'Japón',
    vuelos: [
      { aerolinea: 'All Nippon Airways (ANA)', fechas: '05 Ene - 18 Ene 2027', precio: '$1.680 USD', disponibilidad: '6 asientos disponibles' },
      { aerolinea: 'United Airlines', fechas: '10 Ene - 23 Ene 2027', precio: '$1.490 USD', disponibilidad: '10 asientos disponibles' },
    ],
    hoteles: [
      { nombre: 'Shinjuku Granbell Hotel', fechas: '05 Ene - 18 Ene 2027', precio: '$160 USD / noche', disponibilidad: '7 habitaciones disponibles' },
      { nombre: 'The Capitol Hotel Tokyu', fechas: '10 Ene - 23 Ene 2027', precio: '$350 USD / noche', disponibilidad: '3 habitaciones disponibles' },
    ],
  },
  'Cancun': {
    id: 'Cancun',
    nombre: 'Cancún',
    pais: 'México',
    vuelos: [
      { aerolinea: 'LATAM Airlines', fechas: '01 Feb - 08 Feb 2027', precio: '$720 USD', disponibilidad: '12 asientos disponibles' },
      { aerolinea: 'Copa Airlines', fechas: '05 Feb - 12 Feb 2027', precio: '$650 USD', disponibilidad: '9 asientos disponibles' },
    ],
    hoteles: [
      { nombre: 'Resort Riviera Maya All-Inclusive', fechas: '01 Feb - 08 Feb 2027', precio: '$260 USD / noche', disponibilidad: '8 habitaciones disponibles' },
      { nombre: 'Hotel Boutique Playa Linda', fechas: '05 Feb - 12 Feb 2027', precio: '$110 USD / noche', disponibilidad: '11 habitaciones disponibles' },
    ],
  },
  'Cusco': {
    id: 'Cusco',
    nombre: 'Cusco',
    pais: 'Perú',
    vuelos: [
      { aerolinea: 'LATAM Airlines', fechas: '12 Mar - 18 Mar 2027', precio: '$420 USD', disponibilidad: '15 asientos disponibles' },
      { aerolinea: 'SKY Airline', fechas: '15 Mar - 21 Mar 2027', precio: '$360 USD', disponibilidad: '7 asientos disponibles' },
    ],
    hoteles: [
      { nombre: 'Palacio del Inka Luxury', fechas: '12 Mar - 18 Mar 2027', precio: '$230 USD / noche', disponibilidad: '5 habitaciones disponibles' },
      { nombre: 'Tierra Viva Cusco San Blas', fechas: '15 Mar - 21 Mar 2027', precio: '$85 USD / noche', disponibilidad: '9 habitaciones disponibles' },
    ],
  },
  'Roma': {
    id: 'Roma',
    nombre: 'Roma',
    pais: 'Italia',
    vuelos: [
      { aerolinea: 'ITA Airways', fechas: '02 Abr - 14 Abr 2027', precio: '$1.180 USD', disponibilidad: '5 asientos disponibles' },
      { aerolinea: 'Air Europa', fechas: '08 Abr - 20 Abr 2027', precio: '$1.040 USD', disponibilidad: '7 asientos disponibles' },
    ],
    hoteles: [
      { nombre: 'Hotel Colosseo Imperial', fechas: '02 Abr - 14 Abr 2027', precio: '$175 USD / noche', disponibilidad: '6 habitaciones disponibles' },
      { nombre: 'Trevi Palace Luxury Inn', fechas: '08 Abr - 20 Abr 2027', precio: '$210 USD / noche', disponibilidad: '3 habitaciones disponibles' },
    ],
  },
};

// ---------------------------------------------------------------------------
// Interceptores combinados REST y GraphQL
// ---------------------------------------------------------------------------
export const handlers = [
  // Interceptor REST: GET /api/destinos (alineado con la sesión del docente)
  http.get('*/api/destinos', async ({ request }) => {
    await delay(600);

    const url = new URL(request.url);
    const error = url.searchParams.get('error') || (url.searchParams.get('simularError') === 'true' ? '500' : null);

    if (error === '404') {
      return HttpResponse.json(
        { mensaje: 'El recurso de destinos no fue encontrado' },
        { status: 404 }
      );
    }

    if (error === '500') {
      return HttpResponse.json(
        { mensaje: 'Error interno del servidor' },
        { status: 500 }
      );
    }

    return HttpResponse.json(destinos);
  }),

  // Interceptor GraphQL: ObtenerDetalleDestino
  apiGraphql.query('ObtenerDetalleDestino', async ({ variables }) => {
    await delay(350);

    const { id, destino, simularError } = variables || {};
    const destinoId = id || destino;

    // 1. Simulación de error controlada (HTTP 200 con arreglo errors)
    if (simularError) {
      return HttpResponse.json({
        errors: [
          {
            message: 'No fue posible obtener los vuelos y hoteles del destino seleccionado.',
            extensions: { code: 'ERROR_SIMULADO' },
          },
        ],
      });
    }

    // 2. Búsqueda insensible a mayúsculas/minúsculas
    const clave = Object.keys(detallesPorDestino).find(
      (k) => k.toLowerCase() === (destinoId || '').toLowerCase()
    );
    const detalle = detallesPorDestino[clave] || detallesPorDestino[destinoId];

    // 3. Destino no encontrado (HTTP 200 con código NO_ENCONTRADO en errors)
    if (!detalle) {
      return HttpResponse.json({
        errors: [
          {
            message: `No se encontró el destino turístico con identificador "${destinoId}".`,
            extensions: { code: 'NO_ENCONTRADO' },
          },
        ],
      });
    }

    // 4. Respuesta exitosa envuelta en data
    return HttpResponse.json({
      data: {
        destino: detalle,
      },
    });
  }),

  // Compatibilidad con la consulta previa GetDetalleViaje
  apiGraphql.query('GetDetalleViaje', async ({ variables }) => {
    await delay(350);
    const { destino } = variables || {};

    const clave = Object.keys(detallesPorDestino).find(
      (k) => k.toLowerCase() === (destino || '').toLowerCase()
    );
    const detalle = detallesPorDestino[clave] || detallesPorDestino[destino];

    if (!detalle) {
      return HttpResponse.json({
        errors: [{ message: `No se encontraron vuelos ni hoteles para el destino "${destino}"` }],
      });
    }

    return HttpResponse.json({
      data: {
        vuelos: detalle.vuelos,
        hoteles: detalle.hoteles,
      },
    });
  }),

  // Interceptores globales como respaldo
  graphql.query('GetDetalleViaje', async ({ variables }) => {
    await delay(350);
    const { destino } = variables || {};
    const clave = Object.keys(detallesPorDestino).find(
      (k) => k.toLowerCase() === (destino || '').toLowerCase()
    );
    const detalle = detallesPorDestino[clave] || detallesPorDestino[destino];

    if (!detalle) {
      return HttpResponse.json({
        errors: [{ message: `No se encontraron vuelos ni hoteles para el destino "${destino}"` }],
      });
    }

    return HttpResponse.json({
      data: {
        vuelos: detalle.vuelos,
        hoteles: detalle.hoteles,
      },
    });
  }),
];
