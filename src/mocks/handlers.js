import { graphql, HttpResponse, http, delay } from 'msw';

// ---------------------------------------------------------------------------
// Definición de interceptores para Mock Service Worker (MSW).
// Combina la intercepción de peticiones REST tradicionales y consultas GraphQL
// en un mismo arreglo de handlers para el Service Worker del navegador.
// ---------------------------------------------------------------------------
export const handlers = [
  // Interceptor REST: Atiende solicitudes HTTP GET a '/api/destinos'.
  // Retorna una lista con la información general de destinos, país y actividades populares.
  http.get('/api/destinos', async () => {
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

    // Simula una breve latencia de red para visualizar el estado de carga
    await delay(350);

    // HttpResponse.json serializa la respuesta con cabeceras Application/json y status 200
    return HttpResponse.json(destinos);
  }),

  // Interceptor GraphQL: Atiende la operación de consulta 'GetDetalleViaje'.
  // A diferencia de REST que usa URLs, GraphQL intercepta por el nombre de la operación
  // y extrae las variables enviadas por el cliente desde Apollo.
  graphql.query('GetDetalleViaje', async ({ variables }) => {
    // Extracción del parámetro destino enviado en la consulta
    const { destino } = variables;

    // Diccionario de opciones detalladas estructurado por identificador de destino
    const viajesPorDestino = {
      'Paris': {
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

    // Simulación de latencia de red en la consulta GraphQL
    await delay(350);

    // Búsqueda insensible a mayúsculas/minúsculas para máxima compatibilidad
    const clave = Object.keys(viajesPorDestino).find(
      (k) => k.toLowerCase() === (destino || '').toLowerCase()
    );
    const detalle = viajesPorDestino[clave] || viajesPorDestino[destino];

    // En GraphQL los errores se envuelven en un arreglo "errors" dentro del objeto de respuesta
    if (!detalle) {
      return HttpResponse.json({
        errors: [{ message: `No se encontraron vuelos ni hoteles para el destino "${destino}"` }],
      });
    }

    // Respuesta exitosa de GraphQL envuelta en la propiedad "data"
    return HttpResponse.json({
      data: {
        vuelos: detalle.vuelos,
        hoteles: detalle.hoteles,
      },
    });
  }),
];
