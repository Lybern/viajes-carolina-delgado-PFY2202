import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { GRAPHQL_ENDPOINT } from './endpoint';

// ---------------------------------------------------------------------------
// Configuración centralizada de Apollo Client.
// MSW construye respuestas simuladas sin el campo __typename que Apollo
// agrega normalmente a las consultas dirigidas a un servidor GraphQL real.
// addTypename: false evita advertencias innecesarias en la consola.
// ---------------------------------------------------------------------------
export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: GRAPHQL_ENDPOINT }),
  cache: new InMemoryCache({
    addTypename: false,
  }),
});
