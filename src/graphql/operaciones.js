import { gql } from '@apollo/client';

// ---------------------------------------------------------------------------
// Operación de consulta para el detalle de vuelos y hoteles de un destino.
// Incluye la variable opcional $simularError para pruebas de contingencia.
// ---------------------------------------------------------------------------
export const OBTENER_DETALLE_DESTINO = gql`
  query ObtenerDetalleDestino($id: ID!, $simularError: Boolean = false) {
    destino(id: $id, simularError: $simularError) {
      id
      nombre
      pais
      descripcion
      temporada
      imagen
      actividades
      vuelos {
        id
        aerolinea
        origen
        horario
        fechas
        precio
        disponibilidad
      }
      hoteles {
        id
        nombre
        categoria
        ubicacion
        fechas
        precio
        disponibilidad
        servicios
      }
    }
  }
`;
