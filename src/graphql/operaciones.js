import { gql } from '@apollo/client';

// ---------------------------------------------------------------------------
// Operación de consulta para el detalle de vuelos y hoteles de un destino.
// Incluye la variable opcional $simularError para demostrar el manejo de
// errores en GraphQL según lo solicitado por el docente.
// ---------------------------------------------------------------------------
export const OBTENER_DETALLE_DESTINO = gql`
  query ObtenerDetalleDestino($id: ID!, $simularError: Boolean = false) {
    destino(id: $id, simularError: $simularError) {
      id
      nombre
      pais
      vuelos {
        aerolinea
        fechas
        precio
        disponibilidad
      }
      hoteles {
        nombre
        fechas
        precio
        disponibilidad
      }
    }
  }
`;
