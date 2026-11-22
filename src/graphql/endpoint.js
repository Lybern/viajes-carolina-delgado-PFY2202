// BASE_URL termina con "/" tanto en la raíz local ("/") como en una publicación
// bajo una subruta (por ejemplo, "/viajes-carolina-delgado-PFY2202/" en GitHub Pages).
export const GRAPHQL_ENDPOINT = `${import.meta.env.BASE_URL}graphql`;
export const REST_DESTINOS_ENDPOINT = `${import.meta.env.BASE_URL}api/destinos`;
